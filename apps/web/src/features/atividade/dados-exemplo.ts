// Dados fictícios até existir endpoint no contrato para a atividade git.
import type { ActiveBranch } from "@spek/ui/components/active-branches-card";
import type { Contributor } from "@spek/ui/components/contributors-card";
import type { GitActivityDay } from "@spek/ui/components/git-activity-feed";

export const dias: GitActivityDay[] = [
	{
		label: "Hoje",
		commits: [
			{
				hash: "a3f91c2",
				kind: "code",
				author: "BC",
				authorName: "Bruno Costa",
				message: "feat(card): drop entre colunas com reordenação",
				branch: "feat/card-drag-drop",
				change: "add-card-drag-drop",
				files: "src/board/Column.tsx · src/board/useCardDrag.ts · +2",
				additions: 86,
				deletions: 12,
				time: "13:12",
			},
			{
				hash: "5be7210",
				kind: "tasks",
				author: "BC",
				authorName: "Bruno Costa",
				message: "tasks: marca 2.1 e 2.2 como concluídas",
				branch: "feat/card-drag-drop",
				change: "add-card-drag-drop",
				files: "openspec/changes/add-card-drag-drop/tasks.md",
				additions: 2,
				deletions: 2,
				time: "12:40",
			},
			{
				hash: "7d02e4b",
				kind: "spec",
				author: "AL",
				authorName: "Ana Lima",
				message: "spec: cenário de limite WIP excedido",
				branch: "feat/wip-limits",
				change: "add-wip-limits",
				files: "openspec/changes/add-wip-limits/specs/column/spec.md",
				additions: 14,
				deletions: 1,
				time: "09:58",
			},
		],
	},
	{
		label: "Ontem",
		commits: [
			{
				hash: "7d1c3aa",
				kind: "spec",
				author: "AL",
				authorName: "Ana Lima",
				message: "spec(card): cenário de soltar fora da coluna",
				branch: "feat/card-drag-drop",
				change: "add-card-drag-drop",
				files: "openspec/changes/add-card-drag-drop/specs/card/spec.md",
				additions: 9,
				deletions: 0,
				time: "17:21",
			},
			{
				hash: "b81f0d4",
				kind: "tasks",
				author: "CD",
				authorName: "Carla Dias",
				message: "tasks: notificações por e-mail concluídas",
				branch: "feat/email-notifications",
				change: "add-email-notifications",
				files: "openspec/changes/add-email-notifications/tasks.md",
				additions: 3,
				deletions: 3,
				time: "15:02",
			},
			{
				hash: "e19a7f0",
				kind: "spec",
				author: "DR",
				authorName: "Diego Reis",
				message: "design: decisão sobre refresh token",
				branch: "feat/session-timeout",
				change: "update-auth-session-timeout",
				files: "openspec/changes/update-auth-session-timeout/design.md",
				additions: 38,
				deletions: 4,
				time: "10:15",
			},
		],
	},
	{
		label: "20 de novembro",
		commits: [
			{
				hash: "90ac3e5",
				kind: "archive",
				author: "AL",
				authorName: "Ana Lima",
				message: "archive: add-card-labels",
				branch: "main",
				change: "add-card-labels",
				files:
					"openspec/changes/archive/2026-11-20-add-card-labels · openspec/specs/card/spec.md",
				additions: 61,
				deletions: 8,
				time: "16:44",
			},
			{
				hash: "4b6c11d",
				kind: "proposal",
				author: "CD",
				authorName: "Carla Dias",
				message: "proposal: filtros no board",
				branch: "feat/board-filters",
				change: "add-board-filters",
				files: "openspec/changes/add-board-filters/proposal.md",
				additions: 42,
				deletions: 0,
				time: "11:30",
			},
		],
	},
];

export const branchesAtivas: ActiveBranch[] = [
	{
		name: "feat/card-drag-drop",
		ahead: 6,
		behind: 0,
		note: "add-card-drag-drop · 8/14 tasks",
	},
	{
		name: "feat/wip-limits",
		ahead: 4,
		behind: 2,
		note: "add-wip-limits · 2 commits atrás de main",
	},
	{
		name: "feat/session-timeout",
		ahead: 3,
		behind: 0,
		note: "update-auth-session-timeout",
	},
	{
		name: "feat/email-notifications",
		ahead: 9,
		behind: 0,
		note: "add-email-notifications · pronta para merge",
	},
	{
		name: "feat/board-filters",
		ahead: 2,
		behind: 5,
		note: "add-board-filters · 5 commits atrás de main",
	},
];

export const contribuidores: Contributor[] = [
	{ initials: "AL", name: "Ana Lima", commits: 21 },
	{ initials: "BC", name: "Bruno Costa", commits: 17 },
	{ initials: "CD", name: "Carla Dias", commits: 12 },
	{ initials: "DR", name: "Diego Reis", commits: 6 },
];
