import { existsSync } from "node:fs";
import { z } from "zod";

const envSchema = z.object({
	APP_ENV: z.enum(["dev", "test", "prod"]).default("dev"),
	PORT: z.coerce.number().int().default(4000),
	CORS_ORIGINS: z
		.string()
		.default("http://localhost:3000")
		.transform((valor) =>
			valor
				.split(",")
				.map((origem) => origem.trim())
				.filter(Boolean),
		),
});

export type Env = z.infer<typeof envSchema>;

export function carregarArquivoEnv(caminho = ".env"): void {
	if (existsSync(caminho)) process.loadEnvFile(caminho);
}

export function parseEnv(source: NodeJS.ProcessEnv): Env {
	const result = envSchema.safeParse(source);
	if (result.success) return result.data;
	const linhas = result.error.issues.map(
		(i) => `  - ${i.path.join(".")}: ${i.message}`,
	);
	throw new Error(`Configuração inválida:\n${linhas.join("\n")}`);
}
