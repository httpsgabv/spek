import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { ENV } from "./infrastructure/config/config.module";
import type { Env } from "./infrastructure/config/env";
import { configurarApp } from "./presentation/configurar-app";

export async function criarApp(
	opcoes: { logger?: false } = {},
): Promise<NestFastifyApplication> {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
		{ bufferLogs: true, abortOnError: false, ...opcoes },
	);
	const env = app.get<Env>(ENV);
	configurarApp(app, { ambiente: env.APP_ENV, origensCors: env.CORS_ORIGINS });
	return app;
}
