import { defineConfig } from "orval";

// Fonte: openapi/api.json, exportado pela API (`pnpm contracts:generate` na raiz).
export default defineConfig({
	api: {
		input: "./openapi/api.json",
		output: {
			mode: "single",
			target: "./src/generated/api.ts",
			client: "react-query",
			httpClient: "fetch",
			clean: true,
			override: {
				mutator: { path: "./src/custom-fetch.ts", name: "customFetch" },
			},
		},
	},
	apiZod: {
		input: "./openapi/api.json",
		output: {
			mode: "single",
			target: "./src/generated/api.zod.ts",
			client: "zod",
		},
	},
});
