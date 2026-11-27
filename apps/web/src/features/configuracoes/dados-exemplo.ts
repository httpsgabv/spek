import type {
	AssistantSettingsValue,
	GitSettingsValue,
	SettingsRepository,
} from "@spek/ui/components/settings-panels";

// Dados fictícios até existir endpoint no contrato para configurações.

export const repositoriosConfigurados: SettingsRepository[] = [
	{
		name: "kanban-board",
		path: "~/dev/kanban-board",
		initials: "KB",
		status: "openspec/ ok · 9 changes",
		baseBranch: "main",
		readAt: "1 min",
	},
	{
		name: "api-pedidos",
		path: "~/dev/api-pedidos",
		initials: "AP",
		status: "openspec/ ok · 4 changes",
		baseBranch: "main",
		readAt: "2 h",
	},
	{
		name: "app-mobile",
		path: "~/dev/app-mobile",
		initials: "AM",
		status: "openspec/ ok · 2 changes",
		baseBranch: "develop",
		readAt: "ontem",
	},
	{
		name: "design-system",
		path: "~/dev/design-system",
		initials: "DS",
		status: "openspec/ não encontrado",
		warning: true,
		baseBranch: "main",
		readAt: "—",
	},
];

/** Caminho já checado, com o resultado que a API devolveria. */
export const caminhoChecado = {
	path: "~/dev/portal-exemplo",
	check: {
		ok: true,
		message: "Repositório git encontrado · openspec/ com 4 specs e 3 changes",
	},
};

export const executavelGit = "/usr/bin/git";

export const gitInicial: GitSettingsValue = {
	includeRemotes: true,
	linkByMessage: true,
};

export const provedores = [
	{ value: "anthropic", label: "Anthropic" },
	{ value: "openai", label: "OpenAI" },
	{ value: "local", label: "Modelo local" },
];

export const assistenteInicial: AssistantSettingsValue = {
	provider: "",
	apiKey: "",
	openspecOnly: true,
};
