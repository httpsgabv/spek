import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeAll, describe, expect, test, vi } from "vitest";
import { Leitura } from "./leitura";

beforeAll(() => {
	vi.stubGlobal(
		"ResizeObserver",
		class {
			observe() {}
			unobserve() {}
			disconnect() {}
		},
	);
});

describe("Modo leitura", () => {
	test("mostra a proposal, as tasks e o histórico do arquivo", () => {
		render(<Leitura changeId="add-card-drag-drop" />);

		expect(
			screen.getByRole("heading", {
				level: 1,
				name: "Arrastar e soltar cards entre colunas",
			}),
		).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "Why" })).toBeInTheDocument();
		expect(screen.getByText("8/14 concluídas")).toBeInTheDocument();
		expect(screen.getByRole("checkbox", { name: "Task 2.1" })).toBeChecked();
		expect(
			screen.getByRole("checkbox", { name: "Task 2.3" }),
		).not.toBeChecked();
		const historico = screen.getByRole("complementary", {
			name: "Histórico do arquivo",
		});
		expect(within(historico).getByText("82% · 31 linhas")).toBeInTheDocument();
		expect(
			within(historico).getByText("proposal: detalha impacto na API"),
		).toBeInTheDocument();
	});

	test("oculta a autoria na margem", () => {
		render(<Leitura changeId="add-card-drag-drop" />);
		expect(
			screen.getAllByRole("button", { name: /Escrito por Bruno Costa/ }),
		).toHaveLength(2);

		fireEvent.click(screen.getByRole("switch", { name: "Autoria na margem" }));

		expect(
			screen.queryByRole("button", { name: /Escrito por/ }),
		).not.toBeInTheDocument();
	});

	test("filtra a árvore do openspec pela busca", () => {
		render(<Leitura changeId="add-card-drag-drop" />);
		const arvore = screen.getByRole("navigation", {
			name: "Árvore do openspec",
		});

		fireEvent.change(
			screen.getByRole("searchbox", { name: "Buscar nas specs" }),
			{
				target: { value: "swimlanes" },
			},
		);

		expect(
			within(arvore).getByRole("link", { name: "add-swimlanes" }),
		).toHaveAttribute("href", "/leitura/add-swimlanes");
		expect(within(arvore).queryByText("auth")).not.toBeInTheDocument();
	});

	test("ajusta o tamanho da fonte", () => {
		render(<Leitura changeId="add-card-drag-drop" />);
		const aumentar = screen.getByRole("button", { name: "Aumentar fonte" });

		fireEvent.click(aumentar);

		expect(aumentar).toBeDisabled();
		expect(
			screen.getByRole("button", { name: "Diminuir fonte" }),
		).toBeEnabled();
	});

	test("avisa quando a change não existe", () => {
		render(<Leitura changeId="nao-existe" />);

		expect(
			screen.getByText("não encontrada.", { exact: false }),
		).toBeInTheDocument();
	});
});
