import type {
	AssistantConversationGroup,
	AssistantMessage,
	AssistantSource,
} from "@spek/ui/components/assistant-chat";

// Dados fictícios até existir endpoint no contrato para o assistente.

export const grupos: AssistantConversationGroup[] = [
	{
		label: "Hoje",
		conversations: [
			{ id: "conflitos-column", title: "Conflitos na capability column" },
			{ id: "resumo-semana", title: "Resumo da semana para a gestão" },
		],
	},
	{
		label: "Ontem",
		conversations: [
			{
				id: "auth-session-timeout",
				title: "O que muda em auth com session-timeout?",
			},
			{ id: "requisitos-sem-cenario", title: "Requisitos sem cenário" },
		],
	},
	{
		label: "Últimos 7 dias",
		conversations: [
			{ id: "swimlanes-filtros", title: "Comparar swimlanes e filtros" },
			{ id: "prontas-archive", title: "Changes prontas para archive" },
		],
	},
];

function Codigo({ children }: { children: string }) {
	return <span className="font-mono text-foreground">{children}</span>;
}

export const mensagens: AssistantMessage[] = [
	{
		id: "m1",
		role: "user",
		content: (
			<>
				Quais changes ativas alteram a capability{" "}
				<span className="font-mono">column</span> e podem conflitar entre si?
			</>
		),
	},
	{
		id: "m2",
		role: "assistant",
		steps: [
			{ label: "leu 3 deltas em specs/column", done: true },
			{ label: "leu openspec/specs/column/spec.md", done: true },
		],
		content: (
			<>
				<p>
					Três changes ativas têm deltas em <Codigo>column</Codigo>:
				</p>
				<ul className="flex list-disc flex-col gap-1.5 pl-5">
					<li>
						<Codigo>add-card-drag-drop</Codigo> · ADDED “Destino de soltura na
						coluna”
					</li>
					<li>
						<Codigo>add-wip-limits</Codigo> · ADDED “Limite WIP por coluna”,
						MODIFIED “Mover card para coluna”
					</li>
					<li>
						<Codigo>add-swimlanes</Codigo> · MODIFIED “Layout da coluna”
					</li>
				</ul>
				<p>
					<strong className="font-semibold text-warning">
						Possível conflito:
					</strong>{" "}
					<span className="font-mono">add-wip-limits</span> passa a bloquear a
					entrada de cards numa coluna cheia, mas o cenário de drag and drop
					assume que o card sempre pode ser solto. Falta um cenário “soltar em
					coluna no limite WIP” em uma das duas changes.
				</p>
			</>
		),
		citations: [
			{ n: 1, label: "add-wip-limits/specs/column", href: "/kanban" },
			{ n: 2, label: "add-card-drag-drop/specs/column", href: "/kanban" },
			{
				n: 3,
				label: "specs/column/spec.md",
				href: "/leitura/add-card-drag-drop",
			},
		],
	},
	{
		id: "m3",
		role: "user",
		content: (
			<>
				E o que ainda falta em{" "}
				<span className="font-mono">add-card-drag-drop</span>? Quem está
				mexendo?
			</>
		),
	},
	{
		id: "m4",
		role: "assistant",
		pending: true,
		steps: [
			{ label: "tasks.md", done: true },
			{ label: "git log feat/card-drag-drop", done: false },
		],
	},
];

export const fontes: AssistantSource[] = [
	{
		n: 1,
		path: "changes/add-wip-limits/specs/column/spec.md",
		tag: "MODIFIED",
		requirement: "Requirement: Mover card para coluna",
		text: "O sistema SHALL recusar a entrada de um card quando a coluna atingiu o limite WIP configurado.",
	},
	{
		n: 2,
		path: "changes/add-card-drag-drop/specs/column/spec.md",
		tag: "ADDED",
		requirement: "Requirement: Destino de soltura na coluna",
		text: "WHEN o usuário solta um card sobre uma coluna THEN o card é inserido na posição indicada.",
	},
	{
		n: 3,
		path: "specs/column/spec.md",
		tag: "ATUAL",
		requirement: "Requirement: Mover card para coluna",
		text: "O sistema SHALL permitir mover um card para qualquer coluna do mesmo board.",
	},
];
