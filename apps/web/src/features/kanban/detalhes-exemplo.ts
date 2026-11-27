// Dados fictícios até existir endpoint no contrato para os detalhes da change.
import type { ChangeDetails } from "@spek/ui/components/change-dialog";
import type { ChangeStage } from "@spek/ui/components/change-stage";
import type { KanbanChange } from "@spek/ui/components/kanban-board";
import type { SpecDeltaFile } from "@spek/ui/components/spec-deltas";

type DetalhesExemplo = {
	change: Partial<ChangeDetails>;
	specs: SpecDeltaFile[];
};

const detalhes: Record<string, DetalhesExemplo> = {
	"add-card-drag-drop": {
		change: {
			branch: "feat/card-drag-drop",
			authors: ["BC", "AL"],
			createdAt: "12/11/2026",
			validation: { ok: true, message: "validate ok" },
			lastChange: { author: "Bruno Costa", hash: "a3f91c2", when: "há 2 h" },
			commits: 6,
		},
		specs: [
			{
				capability: "card",
				groups: [
					{
						operation: "ADDED",
						requirements: [
							{
								title: "Mover card por arrastar e soltar",
								text: "O sistema SHALL permitir que o usuário mova um card para outra coluna arrastando e soltando, preservando o histórico do card.",
								scenarios: [
									{
										title: "Mover card para outra coluna",
										steps: [
											{
												keyword: "WHEN",
												text: "o usuário arrasta um card de “A fazer” e solta em “Em progresso”",
											},
											{
												keyword: "THEN",
												text: "o card aparece em “Em progresso” na posição em que foi solto",
											},
											{
												keyword: "AND",
												text: "a nova coluna é persistida sem recarregar o board",
											},
										],
									},
									{
										title: "Soltar fora de uma coluna",
										steps: [
											{
												keyword: "WHEN",
												text: "o usuário solta o card fora de qualquer coluna",
											},
											{
												keyword: "THEN",
												text: "o card volta para a posição original",
											},
										],
									},
								],
							},
							{
								title: "Feedback visual durante o arraste",
								text: "O sistema SHALL destacar a coluna e a posição de destino enquanto o card é arrastado.",
								scenarios: [
									{
										title: "Destacar destino",
										steps: [
											{
												keyword: "WHEN",
												text: "o usuário arrasta um card sobre uma coluna",
											},
											{
												keyword: "THEN",
												text: "a coluna e a posição de destino ficam destacadas",
											},
										],
									},
								],
							},
						],
					},
					{
						operation: "MODIFIED",
						requirements: [
							{
								title: "Ordem dos cards na coluna",
								previousText:
									"Os cards SHALL ser ordenados pela data de criação.",
								text: "Os cards SHALL manter a ordem definida manualmente pelo usuário; cards novos entram no topo.",
							},
						],
					},
				],
			},
			{
				capability: "column",
				groups: [
					{
						operation: "ADDED",
						requirements: [
							{
								title: "Coluna como área de soltura",
								text: "Cada coluna SHALL aceitar cards soltos em qualquer posição da lista.",
							},
						],
					},
				],
			},
		],
	},
};

export function detalhesDaChange(
	change: KanbanChange,
	stage: ChangeStage,
): { change: ChangeDetails; specs: SpecDeltaFile[] } {
	const extra = detalhes[change.id];
	return {
		change: {
			id: change.id,
			title: change.title,
			stage,
			tasks: change.tasks,
			capabilities: change.capabilities,
			authors: [change.author],
			...extra?.change,
		},
		specs: extra?.specs ?? [],
	};
}
