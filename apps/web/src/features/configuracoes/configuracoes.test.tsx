import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeAll, describe, expect, test, vi } from "vitest";
import { Configuracoes } from "./configuracoes";

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

function repositorios() {
	return within(screen.getByRole("region", { name: "Repositórios" }));
}

describe("Configurações", () => {
	test("mostra repositórios, git e assistente", () => {
		render(<Configuracoes />);

		expect(
			screen.getByRole("heading", { name: "Configurações", level: 1 }),
		).toBeInTheDocument();
		expect(repositorios().getAllByRole("row")).toHaveLength(5);
		expect(
			repositorios().getByText("openspec/ não encontrado"),
		).toBeInTheDocument();
		expect(
			repositorios().getByText(
				"Repositório git encontrado · openspec/ com 4 specs e 3 changes",
			),
		).toBeInTheDocument();
		expect(
			screen.getByRole("switch", { name: /Incluir branches remotas/ }),
		).toBeChecked();
		expect(screen.getByLabelText("Chave de API")).toHaveAttribute(
			"type",
			"password",
		);
		expect(
			screen.getByRole("combobox", { name: "Provedor" }),
		).toBeInTheDocument();
	});

	test("marca Configurações como página ativa no menu", () => {
		render(<Configuracoes />);

		expect(screen.getByRole("link", { name: /Configurações/ })).toHaveAttribute(
			"aria-current",
			"page",
		);
	});

	test("adiciona e remove repositórios", () => {
		render(<Configuracoes />);

		fireEvent.click(repositorios().getByRole("button", { name: "Adicionar" }));
		expect(repositorios().getByText("portal-exemplo")).toBeInTheDocument();
		expect(repositorios().getAllByRole("row")).toHaveLength(6);
		expect(
			repositorios().getByRole("button", { name: "Adicionar" }),
		).toBeDisabled();

		fireEvent.click(
			repositorios().getByRole("button", { name: "Remover design-system" }),
		);
		expect(repositorios().queryByText("design-system")).not.toBeInTheDocument();
	});

	test("liga e desliga as opções do git", () => {
		render(<Configuracoes />);

		const remotas = screen.getByRole("switch", {
			name: /Incluir branches remotas/,
		});
		fireEvent.click(remotas);

		expect(remotas).not.toBeChecked();
	});
});
