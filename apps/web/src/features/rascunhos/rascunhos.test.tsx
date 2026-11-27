import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeAll, describe, expect, test, vi } from "vitest";
import { Rascunhos } from "./rascunhos";

beforeAll(() => {
	vi.stubGlobal(
		"matchMedia",
		vi.fn().mockReturnValue({
			matches: false,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		}),
	);
});

function lista() {
	return within(screen.getByRole("list", { name: "Rascunhos" }));
}

describe("Rascunhos", () => {
	test("mostra a lista e abre o primeiro rascunho no editor", () => {
		render(<Rascunhos />);

		expect(
			screen.getByRole("heading", { name: "Rascunhos", level: 1 }),
		).toBeInTheDocument();
		expect(lista().getAllByRole("listitem")).toHaveLength(6);
		expect(
			screen.getByRole("heading", {
				name: "Cenário de WIP no drag and drop",
				level: 2,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("checkbox", {
				name: "Confirmar com a Ana se o limite bloqueia ou só avisa",
			}),
		).toBeChecked();
		expect(
			screen.getByText("#### Scenario: Soltar em coluna no limite WIP"),
		).toBeInTheDocument();
	});

	test("marca Rascunhos como página ativa no menu", () => {
		render(<Rascunhos />);

		expect(screen.getByRole("link", { name: /Rascunhos/ })).toHaveAttribute(
			"aria-current",
			"page",
		);
	});

	test("filtra por tipo e por busca", () => {
		render(<Rascunhos />);

		fireEvent.click(screen.getByRole("radio", { name: "Dúvidas 1" }));
		expect(lista().getAllByRole("listitem")).toHaveLength(1);
		expect(
			lista().getByText("Refresh token: rotação ou fixo?"),
		).toBeInTheDocument();

		fireEvent.click(screen.getByRole("radio", { name: "Todos 6" }));
		fireEvent.change(
			screen.getByRole("searchbox", { name: "Buscar rascunhos" }),
			{
				target: { value: "swimlanes" },
			},
		);
		expect(lista().getAllByRole("listitem")).toHaveLength(1);

		fireEvent.change(
			screen.getByRole("searchbox", { name: "Buscar rascunhos" }),
			{
				target: { value: "nada disso" },
			},
		);
		expect(
			screen.getByText("Nenhum rascunho com esses filtros."),
		).toBeInTheDocument();
	});

	test("abre outro rascunho e marca itens da checklist", () => {
		render(<Rascunhos />);

		const item = screen.getByRole("checkbox", {
			name: "Decidir em qual change o cenário entra",
		});
		fireEvent.click(item);
		expect(item).toBeChecked();

		fireEvent.click(
			lista().getByRole("button", { name: /Refresh token: rotação ou fixo\?/ }),
		);
		expect(
			screen.getByRole("heading", {
				name: "Refresh token: rotação ou fixo?",
				level: 2,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByText("update-auth-session-timeout", {
				selector: "span.font-mono",
			}),
		).toBeInTheDocument();
	});
});
