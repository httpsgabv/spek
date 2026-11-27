import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeAll, describe, expect, test, vi } from "vitest";
import { Specs } from "./specs";

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

function arvore() {
	return within(screen.getByRole("navigation", { name: "Árvore do openspec" }));
}

describe("Specs", () => {
	test("lista as specs em árvore e abre a primeira em modo leitura", () => {
		render(<Specs />);

		expect(
			screen.getByRole("heading", { name: "Specs", level: 1 }),
		).toBeInTheDocument();
		expect(arvore().getAllByRole("link")).toHaveLength(6);
		expect(arvore().getByRole("link", { name: /auth/ })).toHaveAttribute(
			"aria-current",
			"page",
		);
		const spec = screen.getByRole("article", { name: "auth" });
		expect(
			within(spec).getByText("openspec/specs/auth/spec.md"),
		).toBeInTheDocument();
		expect(
			within(spec).getByRole("heading", {
				name: "Requirement: Login com e-mail e senha",
			}),
		).toBeInTheDocument();
		expect(
			within(spec).getByText("Scenario: Senha incorreta"),
		).toBeInTheDocument();
	});

	test("abre a spec escolhida e mostra as changes que a alteram", () => {
		render(<Specs spec="column" />);

		expect(arvore().getByRole("link", { name: /column/ })).toHaveAttribute(
			"aria-current",
			"page",
		);
		const spec = screen.getByRole("article", { name: "column" });
		expect(within(spec).getByText("2 requisitos")).toBeInTheDocument();
		expect(
			within(spec).getByRole("link", { name: "add-wip-limits" }),
		).toHaveAttribute("href", "/leitura/add-wip-limits");
		expect(arvore().getByRole("link", { name: /card/ })).toHaveAttribute(
			"href",
			"/specs?spec=card",
		);
	});

	test("avisa quando a spec não existe", () => {
		render(<Specs spec="inexistente" />);

		expect(screen.getByText(/não\s+encontrada/)).toBeInTheDocument();
	});

	test("filtra a árvore pela busca", () => {
		render(<Specs />);

		fireEvent.change(screen.getByRole("searchbox", { name: "Buscar spec" }), {
			target: { value: "not" },
		});

		expect(arvore().getAllByRole("link")).toHaveLength(1);
		expect(
			arvore().getByRole("link", { name: /notifications/ }),
		).toBeInTheDocument();
	});

	test("marca Specs como página ativa no menu", () => {
		render(<Specs />);

		expect(screen.getByRole("link", { name: /^Specs$/ })).toHaveAttribute(
			"aria-current",
			"page",
		);
	});
});
