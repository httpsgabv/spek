// Camadas: presentation → core ← infrastructure. Só modules/, app.module.ts,
// main.ts e exportar-openapi.ts (composition root) importam tudo.
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
	forbidden: [
		{
			name: "core-isolado",
			comment: "core não conhece presentation, infrastructure nem modules.",
			severity: "error",
			from: { path: "^src/core/" },
			to: { path: "^src/(presentation|infrastructure|modules)/" },
		},
		{
			name: "core-sem-framework",
			comment:
				"core/domain e core/util não importam Nest nem Fastify; em core/usecases o Nest entra só para @Injectable().",
			severity: "error",
			from: { path: "^src/core/(domain|util)/" },
			to: { path: "node_modules/(@nestjs|fastify|@fastify)/" },
		},
		{
			name: "presentation-sem-infrastructure",
			severity: "error",
			from: { path: "^src/presentation/" },
			to: { path: "^src/(infrastructure|modules)/" },
		},
		{
			name: "infrastructure-sem-presentation",
			severity: "error",
			from: { path: "^src/infrastructure/" },
			to: { path: "^src/(presentation|modules)/" },
		},
		{
			name: "sem-ciclo",
			severity: "error",
			from: {},
			to: { circular: true },
		},
	],
	options: {
		doNotFollow: { path: "node_modules" },
		exclude: { path: "\\.test\\.ts$" },
		tsPreCompilationDeps: true,
		tsConfig: { fileName: "tsconfig.json" },
	},
};
