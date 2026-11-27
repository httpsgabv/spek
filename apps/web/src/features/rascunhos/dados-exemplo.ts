import type { Note } from "@spek/ui/components/notes-board";

// Dados fictícios até existir endpoint no contrato para rascunhos.

export const rascunhos: Note[] = [
	{
		id: "wip-drag-drop",
		kind: "ideia",
		title: "Cenário de WIP no drag and drop",
		excerpt: "Nenhuma das duas changes cobre soltar numa coluna no limite…",
		changes: ["add-card-drag-drop", "add-wip-limits"],
		updated: "3 min",
		body: "O assistente apontou que nenhuma das duas changes cobre o caso de soltar um card numa coluna que já está no limite WIP. Levar para a review de sexta.",
		checklist: [
			{
				id: "1",
				label: "Confirmar com a Ana se o limite bloqueia ou só avisa",
				done: true,
			},
			{ id: "2", label: "Decidir em qual change o cenário entra", done: false },
			{ id: "3", label: "Rascunho do cenário abaixo", done: false },
		],
		snippet: [
			"#### Scenario: Soltar em coluna no limite WIP",
			"- WHEN o usuário solta um card numa coluna cheia",
			"- THEN o card volta à coluna de origem",
			"- AND um aviso mostra o limite da coluna",
		].join("\n"),
	},
	{
		id: "refresh-token",
		kind: "duvida",
		title: "Refresh token: rotação ou fixo?",
		excerpt: "Design cita as duas opções, falta decisão registrada.",
		changes: ["update-auth-session-timeout"],
		updated: "ontem",
		body: "O design.md cita rotação a cada uso e token fixo com expiração longa. Falta registrar qual foi escolhida.",
	},
	{
		id: "swimlanes-etiqueta",
		kind: "ideia",
		title: "Swimlanes também por etiqueta",
		excerpt: "Agrupar por etiqueta além de responsável?",
		changes: ["add-swimlanes"],
		updated: "2 d",
	},
	{
		id: "pauta-review",
		kind: "nota",
		title: "Pauta da review de specs (sexta)",
		excerpt: "WIP x drag and drop, filtros, export legado.",
		changes: [],
		updated: "2 d",
	},
	{
		id: "exportar-imagem",
		kind: "ideia",
		title: "Exportar board como imagem",
		excerpt: "Pedido recorrente. Candidata a nova proposal.",
		changes: [],
		updated: "5 d",
	},
	{
		id: "metricas-gestao",
		kind: "nota",
		title: "Métricas para a gestão",
		excerpt: "Tasks por semana e changes por estágio já bastam.",
		changes: [],
		updated: "1 sem",
	},
];
