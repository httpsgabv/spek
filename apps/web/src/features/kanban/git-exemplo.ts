// Dados fictícios até existir endpoint no contrato para o histórico git da change.
import type {
	GitBranchSummary,
	GitCommit,
} from "@spek/ui/components/change-git-history";
import type { GitDiffLine } from "@spek/ui/components/git-diff";

const ctx = (oldNumber: number, newNumber: number, text: string) =>
	({ kind: "context", oldNumber, newNumber, text }) satisfies GitDiffLine;
const del = (oldNumber: number, text: string) =>
	({ kind: "del", oldNumber, text }) satisfies GitDiffLine;
const add = (newNumber: number, text: string) =>
	({ kind: "add", newNumber, text }) satisfies GitDiffLine;

type HistoricoGit = { branch: GitBranchSummary; commits: GitCommit[] };

export const historicoGit: Record<string, HistoricoGit> = {
	"add-card-drag-drop": {
		branch: {
			name: "feat/card-drag-drop",
			base: "main",
			ahead: 6,
			behind: 0,
			contributors: [
				{
					initials: "BC",
					name: "Bruno Costa",
					commits: 4,
					additions: 312,
					deletions: 40,
				},
				{
					initials: "AL",
					name: "Ana Lima",
					commits: 2,
					additions: 58,
					deletions: 6,
				},
			],
		},
		commits: [
			{
				hash: "a3f91c2",
				author: "BC",
				authorName: "Bruno Costa",
				message: "feat(card): drop entre colunas com reordenação",
				when: "há 2 h",
				date: "hoje, 13:12",
				additions: 86,
				deletions: 12,
				files: [
					{
						path: "openspec/changes/add-card-drag-drop/tasks.md",
						additions: 4,
						deletions: 4,
						note: "2 tasks marcadas",
						hunks: [
							{
								header: "@@ -8,7 +8,7 @@ ## 2. Interação",
								lines: [
									ctx(8, 8, "## 2. Interação"),
									ctx(9, 9, ""),
									del(10, "- [ ] 2.1 Implementar dragstart e dragover no card"),
									del(11, "- [ ] 2.2 Calcular posição de destino na coluna"),
									add(10, "- [x] 2.1 Implementar dragstart e dragover no card"),
									add(11, "- [x] 2.2 Calcular posição de destino na coluna"),
									ctx(12, 12, "- [ ] 2.3 Persistir a nova coluna via API"),
									ctx(13, 13, "- [ ] 2.4 Reverter posição se a API falhar"),
								],
							},
						],
					},
					{
						path: "src/board/Column.tsx",
						additions: 48,
						deletions: 8,
						hiddenLines: 38,
						hunks: [
							{
								header: "@@ -21,9 +21,12 @@ export function Column",
								lines: [
									ctx(
										21,
										21,
										"export function Column({ column, cards }: Props) {",
									),
									add(
										22,
										"  const { onDragOver, onDrop, dropIndex } = useCardDrag(column.id);",
									),
									ctx(22, 23, ""),
									ctx(23, 24, "  return ("),
									del(24, '    <section className="column">'),
									add(
										25,
										'    <section className="column" onDragOver={onDragOver} onDrop={onDrop}>',
									),
									ctx(25, 26, "      <ColumnHeader column={column} />"),
									add(27, "      {dropIndex === 0 && <DropMarker />}"),
									ctx(26, 28, "      {cards.map((card) => ("),
								],
							},
						],
					},
					{
						path: "src/board/useCardDrag.ts",
						additions: 31,
						deletions: 0,
					},
					{
						path: "tests/board/drag.spec.ts",
						additions: 3,
						deletions: 0,
					},
				],
			},
			{
				hash: "5be7210",
				author: "BC",
				authorName: "Bruno Costa",
				message: "tasks: marca 2.1 e 2.2 como concluídas",
				when: "há 3 h",
				date: "hoje, 12:40",
				additions: 2,
				deletions: 2,
				files: [
					{
						path: "openspec/changes/add-card-drag-drop/tasks.md",
						additions: 2,
						deletions: 2,
					},
				],
			},
			{
				hash: "7d1c3aa",
				author: "AL",
				authorName: "Ana Lima",
				message: "spec(card): cenário de soltar fora da coluna",
				when: "ontem",
				date: "ontem, 17:21",
				additions: 9,
				deletions: 0,
				files: [
					{
						path: "openspec/changes/add-card-drag-drop/specs/card/spec.md",
						additions: 9,
						deletions: 0,
					},
				],
			},
			{
				hash: "c09e4f1",
				author: "BC",
				authorName: "Bruno Costa",
				message: "feat(card): handlers de dragstart e dragover",
				when: "2 d",
				date: "25/11, 16:05",
				additions: 140,
				deletions: 22,
				files: [
					{ path: "src/board/Card.tsx", additions: 96, deletions: 18 },
					{ path: "src/board/useCardDrag.ts", additions: 44, deletions: 4 },
				],
			},
			{
				hash: "1f8e2b9",
				author: "AL",
				authorName: "Ana Lima",
				message: "design: escolha da API nativa de drag and drop",
				when: "3 d",
				date: "24/11, 10:48",
				additions: 49,
				deletions: 6,
				files: [
					{
						path: "openspec/changes/add-card-drag-drop/design.md",
						additions: 49,
						deletions: 6,
					},
				],
			},
			{
				hash: "0a4d7e6",
				author: "BC",
				authorName: "Bruno Costa",
				message: "proposal: add-card-drag-drop",
				when: "12/11",
				date: "12/11, 09:30",
				additions: 84,
				deletions: 4,
				files: [
					{
						path: "openspec/changes/add-card-drag-drop/proposal.md",
						additions: 84,
						deletions: 4,
					},
				],
			},
		],
	},
};
