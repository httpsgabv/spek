import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeAll, describe, expect, test, vi } from "vitest";
import { Kanban } from "./kanban";

beforeAll(() => {
	vi.stubGlobal(
		"ResizeObserver",
		class {
			observe() {}
			unobserve() {}
			disconnect() {}
		},
	);
	vi.stubGlobal(
		"matchMedia",
		vi.fn().mockReturnValue({
			matches: false,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		}),
	);
});

describe("Kanban", () => {
	test("mostra as changes agrupadas por estágio e as arquivadas", () => {
		render(<Kanban />);

		expect(screen.getByRole("heading", { name: "Kanban" })).toBeInTheDocument();
		const andamento = screen.getByRole("region", { name: "Em andamento" });
		expect(
			within(andamento).getByText("add-card-drag-drop"),
		).toBeInTheDocument();
		expect(within(andamento).getByText("8/14")).toBeInTheDocument();
		const arquivadas = screen.getByRole("region", { name: "Arquivadas" });
		expect(within(arquivadas).getByText("add-card-labels")).toBeInTheDocument();
		expect(within(arquivadas).getByText("Ver mais 20")).toBeInTheDocument();
	});

	test("marca o Kanban como página ativa no menu", () => {
		render(<Kanban />);

		expect(screen.getByRole("link", { name: /Kanban/ })).toHaveAttribute(
			"aria-current",
			"page",
		);
	});

	test("filtra changes pela busca", () => {
		render(<Kanban />);

		fireEvent.change(screen.getByRole("searchbox", { name: "Buscar change" }), {
			target: { value: "swimlanes" },
		});

		expect(screen.getByText("add-swimlanes")).toBeInTheDocument();
		expect(screen.queryByText("add-card-drag-drop")).not.toBeInTheDocument();
	});

	test("filtra changes por capability", () => {
		render(<Kanban />);

		fireEvent.click(screen.getByRole("button", { name: "+2" }));
		fireEvent.click(screen.getByRole("radio", { name: "auth" }));

		expect(screen.getByText("update-auth-session-timeout")).toBeInTheDocument();
		expect(screen.queryByText("add-wip-limits")).not.toBeInTheDocument();
	});

	test("alterna para a visão em lista", () => {
		render(<Kanban />);

		fireEvent.click(screen.getByRole("radio", { name: "Lista" }));

		expect(screen.getByText("Progresso das changes")).toBeInTheDocument();
		expect(
			screen.queryByRole("region", { name: "Arquivadas" }),
		).not.toBeInTheDocument();
	});
});

describe("Modal da change", () => {
	function abrirDragDrop() {
		render(<Kanban />);
		fireEvent.click(
			screen.getByRole("button", { name: "Abrir add-card-drag-drop" }),
		);
		return screen.getByRole("dialog");
	}

	test("abre a change ao clicar no card, na aba Specs", () => {
		const modal = abrirDragDrop();

		expect(
			within(modal).getByRole("heading", {
				name: "Arrastar e soltar cards entre colunas",
			}),
		).toBeInTheDocument();
		expect(within(modal).getByText("feat/card-drag-drop")).toBeInTheDocument();
		expect(within(modal).getByRole("tab", { name: /Specs/ })).toHaveAttribute(
			"aria-selected",
			"true",
		);
		expect(
			within(modal).getByRole("heading", {
				name: "Requirement: Mover card por arrastar e soltar",
			}),
		).toBeInTheDocument();
		expect(
			within(modal).getByText("o card volta para a posição original"),
		).toBeInTheDocument();
	});

	test("troca o arquivo de delta exibido", () => {
		const modal = abrirDragDrop();

		fireEvent.click(
			within(modal).getByRole("button", { name: /column\/spec\.md/ }),
		);

		expect(
			within(modal).getByRole("heading", {
				name: "Requirement: Coluna como área de soltura",
			}),
		).toBeInTheDocument();
		expect(
			within(modal).getByText("openspec/specs/column/spec.md"),
		).toBeInTheDocument();
	});

	test("mostra só o texto novo do requisito modificado", () => {
		const modal = abrirDragDrop();
		expect(
			within(modal).getByText(/ser ordenados pela data de criação/),
		).toBeInTheDocument();

		fireEvent.click(within(modal).getByRole("radio", { name: "Só o novo" }));

		expect(
			within(modal).queryByText(/ser ordenados pela data de criação/),
		).not.toBeInTheDocument();
		expect(
			within(modal).getByText(/manter a ordem definida manualmente/),
		).toBeInTheDocument();
	});

	test("aponta o modo leitura da change", () => {
		const modal = abrirDragDrop();

		expect(
			within(modal).getByRole("link", { name: "Modo leitura" }),
		).toHaveAttribute("href", "/leitura/add-card-drag-drop");
	});

	test("fecha o modal", () => {
		const modal = abrirDragDrop();

		fireEvent.click(within(modal).getByRole("button", { name: "Fechar" }));

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});
});

describe("Aba Git do modal", () => {
	function abrirGit() {
		render(<Kanban />);
		fireEvent.click(
			screen.getByRole("button", { name: "Abrir add-card-drag-drop" }),
		);
		const modal = screen.getByRole("dialog");
		fireEvent.mouseDown(within(modal).getByRole("tab", { name: /Git/ }), {
			button: 0,
		});
		return modal;
	}

	test("mostra a branch, os commits e o diff do commit mais recente", () => {
		const modal = abrirGit();

		expect(
			within(modal).getByText("à frente de main", { exact: false }),
		).toBeInTheDocument();
		const commits = within(modal).getByRole("navigation", {
			name: "Commits relacionados",
		});
		expect(within(commits).getAllByRole("button")).toHaveLength(6);
		expect(
			within(modal).getByRole("heading", {
				name: "feat(card): drop entre colunas com reordenação",
			}),
		).toBeInTheDocument();
		expect(within(modal).getByText("2 tasks marcadas")).toBeInTheDocument();
		expect(
			within(modal).getByText("Mais 38 linhas alteradas"),
		).toBeInTheDocument();
	});

	test("troca o commit exibido", () => {
		const modal = abrirGit();

		fireEvent.click(
			within(modal).getByRole("button", {
				name: /proposal: add-card-drag-drop/,
			}),
		);

		expect(
			within(modal).getByRole("heading", {
				name: "proposal: add-card-drag-drop",
			}),
		).toBeInTheDocument();
		expect(
			within(modal).getByText("O diff deste commit ainda não foi carregado."),
		).toBeInTheDocument();
	});

	test("alterna o diff para lado a lado", () => {
		const modal = abrirGit();
		expect(
			within(modal).getAllByText("Removida:", { exact: false }),
		).toHaveLength(3);

		fireEvent.click(within(modal).getByRole("radio", { name: "Lado a lado" }));

		expect(
			within(modal).getByRole("radio", { name: "Lado a lado" }),
		).toHaveAttribute("aria-checked", "true");
		expect(
			within(modal).getAllByText("Removida:", { exact: false }),
		).toHaveLength(3);
	});
});
