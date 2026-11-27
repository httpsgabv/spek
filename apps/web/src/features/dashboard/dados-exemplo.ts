// Dados fictícios até existir endpoint no contrato para o dashboard.
import type { AppSidebarRepository } from "@spek/ui/components/app-sidebar";
import type { ChangesByStageCardProps } from "@spek/ui/components/changes-by-stage-card";
import type { ChangeProgress } from "@spek/ui/components/changes-progress-card";
import type { ActivityItem } from "@spek/ui/components/recent-activity-card";
import type { StatCardProps } from "@spek/ui/components/stat-card";

export const repositorioAtual: AppSidebarRepository = {
	name: "kanban-board",
	path: "~/dev/kanban-board",
	initials: "KB",
	summary: "9 changes ativas",
};

export const repositorios: AppSidebarRepository[] = [
	repositorioAtual,
	{
		name: "api-pedidos",
		path: "~/dev/api-pedidos",
		initials: "AP",
		summary: "4 changes ativas",
	},
	{
		name: "app-mobile",
		path: "~/dev/app-mobile",
		initials: "AM",
		summary: "2 changes ativas",
	},
	{
		name: "design-system",
		path: "~/dev/design-system",
		initials: "DS",
		summary: "openspec/ não encontrado",
		warning: true,
	},
];

export const indicadores: StatCardProps[] = [
	{
		label: "Changes ativas",
		value: 9,
		trend: { label: "↑ 2", tone: "success" },
		description: "2 novas propostas esta semana",
	},
	{
		label: "Tasks concluídas",
		value: 32,
		total: 65,
		trend: { label: "49%", tone: "success" },
		progress: 49,
	},
	{
		label: "Requisitos nas specs",
		value: 48,
		trend: { label: "↑ 5", tone: "success" },
		description: "em 6 capabilities · 131 cenários",
	},
	{
		label: "Arquivadas",
		value: 23,
		trend: { label: "↑ 4", tone: "success" },
		description: "4 arquivadas este mês",
	},
	{
		label: "Validação",
		value: 7,
		total: 9,
		trend: { label: "! 2 avisos", tone: "warning" },
		description: "changes passam no openspec validate",
	},
];

export const tasksPorSemana = [
	{ week: "07/09", tasks: 4 },
	{ week: "14/09", tasks: 6 },
	{ week: "21/09", tasks: 5 },
	{ week: "28/09", tasks: 8 },
	{ week: "05/10", tasks: 7 },
	{ week: "12/10", tasks: 9 },
	{ week: "19/10", tasks: 6 },
	{ week: "26/10", tasks: 11 },
	{ week: "02/11", tasks: 9 },
	{ week: "09/11", tasks: 12 },
	{ week: "16/11", tasks: 10 },
	{ week: "23/11", tasks: 14 },
];

export const estagios: ChangesByStageCardProps["stages"] = [
	{ stage: "proposta", count: 2 },
	{ stage: "design", count: 2 },
	{ stage: "andamento", count: 3 },
	{ stage: "concluida", count: 2, label: "Concluída (a arquivar)" },
];

export const capabilities: ChangesByStageCardProps["capabilities"] = [
	{ name: "card", requirements: 14 },
	{ name: "board", requirements: 12 },
	{ name: "auth", requirements: 8 },
	{ name: "notifications", requirements: 6 },
	{ name: "column", requirements: 5 },
	{ name: "export", requirements: 3 },
];

export const changes: ChangeProgress[] = [
	{
		id: "add-card-drag-drop",
		stage: "andamento",
		tasksDone: 8,
		tasksTotal: 14,
		author: "BC",
		updatedAt: "há 2 h",
	},
	{
		id: "add-wip-limits",
		stage: "andamento",
		tasksDone: 5,
		tasksTotal: 9,
		author: "AL",
		updatedAt: "há 5 h",
	},
	{
		id: "update-auth-session-timeout",
		stage: "andamento",
		tasksDone: 3,
		tasksTotal: 7,
		author: "DR",
		updatedAt: "ontem",
	},
	{
		id: "add-board-filters",
		stage: "design",
		tasksDone: 0,
		tasksTotal: 11,
		author: "CD",
		updatedAt: "há 2 d",
	},
	{
		id: "add-swimlanes",
		stage: "design",
		tasksDone: 0,
		tasksTotal: 8,
		author: "BC",
		updatedAt: "há 3 d",
	},
	{
		id: "add-email-notifications",
		stage: "concluida",
		tasksDone: 10,
		tasksTotal: 10,
		author: "CD",
		updatedAt: "ontem",
	},
	{
		id: "refactor-column-ordering",
		stage: "concluida",
		tasksDone: 6,
		tasksTotal: 6,
		author: "AL",
		updatedAt: "há 2 d",
	},
];

export const atividades: ActivityItem[] = [
	{
		hash: "a3f91c2",
		author: "BC",
		message: "feat(card): drop entre colunas com reordenação",
		path: "changes/add-card-drag-drop/tasks.md",
		when: "2 h",
	},
	{
		hash: "7d02e4b",
		author: "AL",
		message: "spec: cenário de limite WIP excedido",
		path: "changes/add-wip-limits/specs/column",
		when: "5 h",
	},
	{
		hash: "e19a7f0",
		author: "DR",
		message: "design: decisão sobre refresh token",
		path: "changes/update-auth-session-timeout/design.md",
		when: "1 d",
	},
	{
		hash: "4b6c11d",
		author: "CD",
		message: "proposal: filtros no board",
		path: "changes/add-board-filters/proposal.md",
		when: "2 d",
	},
	{
		hash: "90ac3e5",
		author: "AL",
		message: "archive: add-card-labels",
		path: "changes/archive/2026-11-20-add-card-labels",
		when: "7 d",
	},
];
