import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

// O esbuild do Vite ignora emitDecoratorMetadata: sem o SWC a injeção por
// construtor do Nest recebe undefined em silêncio.
const plugins = [
	swc.vite({
		jsc: {
			target: "es2023",
			parser: { syntax: "typescript", decorators: true },
			transform: { legacyDecorator: true, decoratorMetadata: true },
		},
	}),
];

export default defineConfig({
	plugins,
	test: {
		projects: [
			{
				extends: true,
				test: { name: "unit", include: ["src/**/*.test.ts"] },
			},
			{
				extends: true,
				test: {
					name: "integration",
					include: ["tests/integration/**/*.test.ts"],
				},
			},
			{
				extends: true,
				test: { name: "e2e", include: ["tests/e2e/**/*.test.ts"] },
			},
		],
	},
});
