import {
	type ArgumentsHost,
	Catch,
	type ExceptionFilter,
	HttpException,
	Logger,
} from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";
import { ZodValidationException } from "nestjs-zod";
import type { ZodError } from "zod";
import { ErroDeDominio } from "../../core/util/erro-de-dominio";
import { type FieldError, toFieldErrors } from "../validation/zod-path";

interface Problem {
	type: string;
	title: string;
	status: number;
	detail: string;
	errors?: FieldError[];
}

const TITULOS: Record<number, string> = {
	400: "Requisição inválida",
	401: "Não autenticado",
	403: "Acesso negado",
	404: "Não encontrado",
	409: "Conflito",
	422: "Regra de negócio violada",
	429: "Muitas requisições",
};

function classificar(exception: unknown): Problem {
	if (exception instanceof ZodValidationException) {
		return {
			type: "validacao",
			title: "Falha de validação",
			status: 400,
			detail: "Um ou mais campos são inválidos.",
			errors: toFieldErrors(exception.getZodError() as ZodError),
		};
	}
	if (exception instanceof ErroDeDominio) {
		return {
			type: exception.codigo,
			title: TITULOS[exception.status] ?? "Erro",
			status: exception.status,
			detail: exception.message,
		};
	}
	if (exception instanceof HttpException && exception.getStatus() < 500) {
		const status = exception.getStatus();
		return {
			type: "http",
			title: TITULOS[status] ?? "Erro",
			status,
			detail: TITULOS[status] ?? "Requisição não atendida.",
		};
	}
	return {
		type: "interno",
		title: "Erro interno",
		status: 500,
		detail: "Erro inesperado.",
	};
}

// Resposta no formato RFC 7807. Detalhe interno (stack, mensagem) só no log.
@Catch()
export class ProblemDetailFilter implements ExceptionFilter {
	private readonly logger = new Logger(ProblemDetailFilter.name);

	catch(exception: unknown, host: ArgumentsHost) {
		const http = host.switchToHttp();
		const request = http.getRequest<FastifyRequest>();
		const problem = classificar(exception);
		if (problem.status >= 500) {
			this.logger.error(
				exception instanceof Error ? exception.stack : String(exception),
			);
		}
		http
			.getResponse<FastifyReply>()
			.status(problem.status)
			.header("Content-Type", "application/problem+json; charset=utf-8")
			.send({ ...problem, instance: request.url.split("?")[0] });
	}
}
