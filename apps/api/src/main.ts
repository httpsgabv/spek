import { criarApp } from "./criar-app";
import { ENV } from "./infrastructure/config/config.module";
import { carregarArquivoEnv, type Env } from "./infrastructure/config/env";

async function bootstrap() {
	carregarArquivoEnv();
	const app = await criarApp();
	app.enableShutdownHooks();
	await app.listen(app.get<Env>(ENV).PORT, "0.0.0.0");
}

bootstrap().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
