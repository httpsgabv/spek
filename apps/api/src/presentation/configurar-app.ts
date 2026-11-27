import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { SwaggerModule } from "@nestjs/swagger";
import { ZodValidationPipe } from "nestjs-zod";
import { ProblemDetailFilter } from "./filters/problem-detail.filter";
import { criarDocumentoOpenApi } from "./openapi/criar-documento-openapi";

export interface OpcoesApp {
	ambiente: "dev" | "test" | "prod";
	origensCors: string[];
}

// Usado pelo main.ts, pelos testes de integração e pela exportação do
// OpenAPI: todos sobem o app igual à produção.
export function configurarApp(
	app: NestFastifyApplication,
	opcoes: OpcoesApp,
): void {
	app.setGlobalPrefix("api");
	app.enableCors({ origin: opcoes.origensCors, credentials: true });
	app.useGlobalFilters(new ProblemDetailFilter());
	app.useGlobalPipes(new ZodValidationPipe());

	const document = criarDocumentoOpenApi(app);
	if (opcoes.ambiente === "dev") {
		SwaggerModule.setup("docs", app, document, {
			jsonDocumentUrl: "docs/openapi.json",
		});
	}
}
