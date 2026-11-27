import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { criarApp } from "./criar-app";
import { criarDocumentoOpenApi } from "./presentation/openapi/criar-documento-openapi";

// Gera packages/contracts/openapi/api.json, a fonte do cliente gerado pelo Orval.
const DESTINO = resolve(
	__dirname,
	"../../../packages/contracts/openapi/api.json",
);

async function exportar() {
	const app = await criarApp({ logger: false });
	await app.init();
	const document = criarDocumentoOpenApi(app);
	mkdirSync(dirname(DESTINO), { recursive: true });
	writeFileSync(DESTINO, `${JSON.stringify(document, null, "\t")}\n`);
	await app.close();
	console.log(`OpenAPI exportado em ${DESTINO}`);
}

exportar().catch((error) => {
	console.error(error);
	process.exit(1);
});
