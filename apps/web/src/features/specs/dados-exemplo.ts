import type { SpecRequirement } from "@spek/ui/components/spec-deltas";
import type { SpecReaderChange } from "@spek/ui/components/spec-reader";

// Dados fictícios até existir endpoint no contrato para as specs.

export type SpecDoRepositorio = {
	capability: string;
	purpose: string;
	updated: string;
	requirements: SpecRequirement[];
	changes: SpecReaderChange[];
};

function change(id: string): SpecReaderChange {
	return { id, href: `/leitura/${id}` };
}

export const specs: SpecDoRepositorio[] = [
	{
		capability: "auth",
		purpose:
			"Autenticação de quem usa o board: login, sessão e saída do sistema.",
		updated: "há 3 dias",
		changes: [change("update-auth-session-timeout")],
		requirements: [
			{
				title: "Login com e-mail e senha",
				text: "O sistema SHALL autenticar o usuário com e-mail e senha cadastrados.",
				scenarios: [
					{
						title: "Credenciais válidas",
						steps: [
							{
								keyword: "WHEN",
								text: "o usuário informa e-mail e senha corretos",
							},
							{ keyword: "THEN", text: "a sessão é criada" },
							{ keyword: "AND", text: "o usuário é levado ao board" },
						],
					},
					{
						title: "Senha incorreta",
						steps: [
							{ keyword: "WHEN", text: "a senha não confere" },
							{
								keyword: "THEN",
								text: "uma mensagem genérica de erro é exibida",
							},
						],
					},
				],
			},
			{
				title: "Expiração da sessão",
				text: "A sessão MUST expirar após o período de inatividade configurado.",
				scenarios: [
					{
						title: "Sessão inativa",
						steps: [
							{ keyword: "GIVEN", text: "uma sessão sem uso além do limite" },
							{ keyword: "WHEN", text: "o usuário faz uma nova ação" },
							{ keyword: "THEN", text: "ele é levado de volta ao login" },
						],
					},
				],
			},
		],
	},
	{
		capability: "board",
		purpose: "Quadro kanban que organiza os cards em colunas.",
		updated: "há 1 semana",
		changes: [change("add-swimlanes"), change("add-board-filters")],
		requirements: [
			{
				title: "Exibir colunas do board",
				text: "O sistema SHALL exibir as colunas do board na ordem configurada.",
				scenarios: [
					{
						title: "Board com colunas",
						steps: [
							{ keyword: "WHEN", text: "o usuário abre um board" },
							{
								keyword: "THEN",
								text: "as colunas aparecem da esquerda para a direita",
							},
						],
					},
				],
			},
			{
				title: "Board vazio",
				text: "O sistema SHOULD orientar a criação da primeira coluna quando o board não tem colunas.",
			},
		],
	},
	{
		capability: "card",
		purpose: "Cards que representam o trabalho dentro de uma coluna.",
		updated: "ontem",
		changes: [change("add-card-drag-drop")],
		requirements: [
			{
				title: "Criar card",
				text: "O sistema SHALL permitir criar um card com título em qualquer coluna.",
				scenarios: [
					{
						title: "Título preenchido",
						steps: [
							{
								keyword: "WHEN",
								text: "o usuário confirma um título não vazio",
							},
							{ keyword: "THEN", text: "o card aparece no fim da coluna" },
						],
					},
				],
			},
			{
				title: "Editar card",
				text: "O sistema SHALL permitir editar título e descrição de um card existente.",
			},
			{
				title: "Excluir card",
				text: "O sistema MUST pedir confirmação antes de excluir um card.",
				scenarios: [
					{
						title: "Confirmação",
						steps: [
							{ keyword: "WHEN", text: "o usuário escolhe excluir" },
							{ keyword: "THEN", text: "uma confirmação é exibida" },
							{
								keyword: "AND",
								text: "o card só sai do board depois de confirmado",
							},
						],
					},
				],
			},
		],
	},
	{
		capability: "column",
		purpose: "Colunas que agrupam os cards por etapa do fluxo.",
		updated: "há 2 dias",
		changes: [change("add-wip-limits"), change("add-card-drag-drop")],
		requirements: [
			{
				title: "Mover card para coluna",
				text: "O sistema SHALL permitir mover um card para qualquer coluna do mesmo board.",
				scenarios: [
					{
						title: "Mover pelo detalhe",
						steps: [
							{
								keyword: "WHEN",
								text: "o usuário escolhe outra coluna no detalhe do card",
							},
							{
								keyword: "THEN",
								text: "o card passa para o fim da coluna escolhida",
							},
						],
					},
				],
			},
			{
				title: "Layout da coluna",
				text: "Cada coluna SHALL mostrar o nome e a quantidade de cards no cabeçalho.",
			},
		],
	},
	{
		capability: "export",
		purpose: "Exportação dos dados do board para fora do app.",
		updated: "há 1 mês",
		changes: [],
		requirements: [
			{
				title: "Exportar CSV",
				text: "O sistema SHALL exportar os cards do board em CSV com coluna, título e responsável.",
			},
		],
	},
	{
		capability: "notifications",
		purpose: "Avisos para quem acompanha um card.",
		updated: "há 2 semanas",
		changes: [],
		requirements: [
			{
				title: "Aviso de mudança de coluna",
				text: "O sistema SHOULD avisar quem acompanha o card quando ele muda de coluna.",
			},
		],
	},
];
