// Dados fictícios até existir endpoint no contrato para o conteúdo da change.
import type {
	BlameAuthor,
	ReaderSection,
	ReaderTasks,
} from "@spek/ui/components/change-reader";
import type {
	FileBranch,
	FileCommit,
	FileContributor,
} from "@spek/ui/components/file-history-panel";

const bruno: BlameAuthor = {
	initials: "BC",
	name: "Bruno Costa",
	hash: "0a4d7e6",
};
const ana: BlameAuthor = {
	initials: "AL",
	name: "Ana Lima",
	hash: "7d1c3aa",
	recent: true,
};

type ConteudoChange = {
	proposal: ReaderSection[];
	tasks?: ReaderTasks;
	historico: {
		contributors: FileContributor[];
		commits: FileCommit[];
		branches: FileBranch[];
	};
};

export const conteudoDasChanges: Record<string, ConteudoChange> = {
	"add-card-drag-drop": {
		proposal: [
			{
				title: "Why",
				blame: bruno,
				blocks: [
					{
						type: "paragraph",
						text: "Mover um card hoje exige abrir o detalhe e escolher a coluna em um seletor: três cliques para a ação mais comum do board. Arrastar e soltar é o comportamento que os usuários esperam de um kanban.",
					},
				],
			},
			{
				title: "What Changes",
				blame: bruno,
				blocks: [
					{
						type: "list",
						items: [
							{
								text: "Cards podem ser arrastados para outra coluna e reordenados dentro da mesma coluna.",
							},
							{
								text: "Durante o arraste, a coluna e a posição de destino ficam destacadas.",
							},
							{
								text: "A ordem dos cards passa a ser manual em vez de por data de criação",
								tag: "MODIFIED card",
								blame: ana,
							},
						],
					},
				],
			},
			{
				title: "Impact",
				blocks: [
					{
						type: "fields",
						rows: [
							{ label: "Specs afetadas", value: "`card, column`" },
							{
								label: "Código",
								value:
									"`src/board/Column.tsx, src/board/Card.tsx, src/board/useCardDrag.ts (novo)`",
							},
							{
								label: "API",
								value: "`PATCH /cards/:id` passa a aceitar `position`",
							},
						],
					},
				],
			},
		],
		tasks: {
			done: 8,
			total: 14,
			groups: [
				{
					title: "2. Interação",
					tasks: [
						{
							id: "2.1",
							text: "Implementar dragstart e dragover no card",
							done: true,
						},
						{
							id: "2.2",
							text: "Calcular posição de destino na coluna",
							done: true,
						},
						{ id: "2.3", text: "Persistir a nova coluna via API", done: false },
						{
							id: "2.4",
							text: "Reverter posição se a API falhar",
							done: false,
						},
						{
							id: "2.5",
							text: "Destacar coluna de destino durante o arraste",
							done: false,
						},
					],
				},
			],
		},
		historico: {
			contributors: [
				{ initials: "BC", name: "Bruno Costa", percent: 82, lines: 31 },
				{
					initials: "AL",
					name: "Ana Lima",
					percent: 18,
					lines: 7,
					recent: true,
				},
			],
			commits: [
				{
					hash: "7d1c3aa",
					message: "proposal: ordem manual como MODIFIED",
					author: "AL",
					when: "ontem",
				},
				{
					hash: "3c22d90",
					message: "proposal: detalha impacto na API",
					author: "BC",
					when: "10 d",
				},
				{
					hash: "0a4d7e6",
					message: "proposal: add-card-drag-drop",
					author: "BC",
					when: "12/11",
				},
			],
			branches: [
				{ name: "feat/card-drag-drop", current: true, contains: true },
				{ name: "main", contains: false },
			],
		},
	},
};

export const specsDoRepositorio = [
	{ name: "auth", requirements: 8 },
	{ name: "board", requirements: 12 },
	{ name: "card", requirements: 14 },
	{ name: "column", requirements: 5 },
	{ name: "export", requirements: 3 },
	{ name: "notifications", requirements: 6 },
];
