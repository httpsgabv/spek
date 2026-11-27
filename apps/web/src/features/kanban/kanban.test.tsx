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
