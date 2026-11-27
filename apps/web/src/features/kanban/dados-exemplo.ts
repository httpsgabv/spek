// Dados fictícios até existir endpoint no contrato para o kanban.
import type {
	KanbanArchive,
	KanbanColumn,
} from "@spek/ui/components/kanban-board";

export const colunas: KanbanColumn[] = [
	{
		stage: "proposta",
		hint: "Só proposal e deltas, sem tasks",
		changes: [
			{
				id: "add-card-comments",
				title: "Comentários em cards",
				capabilities: ["card"],
				files: ["proposal", "specs"],
				author: "BC",
				updatedAt: "4 d",
			},
			{
				id: "remove-legacy-export",
				title: "Remover exportação CSV legada",
				capabilities: ["export"],
				files: ["proposal", "specs"],
				warning: "Delta REMOVED sem motivo",
				author: "DR",
				updatedAt: "6 d",
			},
		],
	},
	{
		stage: "design",
		hint: "design.md e tasks.md criados, 0 tasks feitas",
		changes: [
			{
				id: "add-board-filters",
				title: "Filtros por responsável, etiqueta e prazo",
				capabilities: ["board", "card"],
				files: ["proposal", "specs", "design", "tasks"],
				tasks: { done: 0, total: 11 },
				author: "CD",
				updatedAt: "2 d",
			},
			{
				id: "add-swimlanes",
				title: "Swimlanes por responsável",
				capabilities: ["board", "column"],
				files: ["proposal", "specs", "design", "tasks"],
				tasks: { done: 0, total: 8 },
				warning: "Requisito sem cenário",
				author: "BC",
				updatedAt: "3 d",
			},
		],
	},
	{
		stage: "andamento",
		hint: "Pelo menos uma task marcada",
		changes: [
			{
				id: "add-card-drag-drop",
				title: "Arrastar e soltar cards entre colunas",
				capabilities: ["card", "column"],
				files: ["proposal", "specs", "design", "tasks"],
				tasks: { done: 8, total: 14 },
				author: "BC",
				updatedAt: "2 h",
			},
			{
				id: "add-wip-limits",
				title: "Limite WIP por coluna",
				capabilities: ["column"],
				files: ["proposal", "specs", "tasks"],
				tasks: { done: 5, total: 9 },
				author: "AL",
				updatedAt: "5 h",
			},
			{
				id: "update-auth-session-timeout",
				title: "Expiração de sessão e refresh token",
				capabilities: ["auth"],
				files: ["proposal", "specs", "design", "tasks"],
				tasks: { done: 3, total: 7 },
				author: "DR",
				updatedAt: "1 d",
			},
		],
	},
	{
		stage: "concluida",
		hint: "Todas as tasks feitas, aguardando archive",
		changes: [
			{
				id: "add-email-notifications",
				title: "Notificações por e-mail",
				capabilities: ["notifications"],
				files: ["proposal", "specs", "design", "tasks"],
				tasks: { done: 10, total: 10 },
				author: "CD",
				updatedAt: "1 d",
			},
			{
				id: "refactor-column-ordering",
				title: "Ordenação estável de colunas",
				capabilities: ["column"],
				files: ["proposal", "specs", "tasks"],
				tasks: { done: 6, total: 6 },
				author: "AL",
				updatedAt: "2 d",
			},
		],
	},
];

export const arquivo: KanbanArchive = {
	total: 23,
	path: "changes/archive/",
	changes: [
		{ id: "add-card-labels", archivedAt: "2026-11-20" },
		{ id: "add-due-dates", archivedAt: "2026-11-14" },
		{ id: "update-board-permissions", archivedAt: "2026-11-03" },
	],
};

export const autores = [
	{ value: "AL", label: "AL" },
	{ value: "BC", label: "BC" },
	{ value: "CD", label: "CD" },
	{ value: "DR", label: "DR" },
];
