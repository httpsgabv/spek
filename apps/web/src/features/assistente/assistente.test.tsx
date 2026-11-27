import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeAll, describe, expect, test, vi } from "vitest";
import { Assistente } from "./assistente";

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

describe("Assistente IA", () => {
	test("mostra a conversa ativa com as leituras, a resposta e as fontes citadas", () => {
		render(<Assistente />);

		expect(
			screen.getByRole("heading", { name: "Conflitos na capability column" }),
		).toBeInTheDocument();
		const log = screen.getByRole("log", { name: "Mensagens" });
		expect(
			within(log).getByText("leu openspec/specs/column/spec.md"),
		).toBeInTheDocument();
		expect(within(log).getByText("Possível conflito:")).toBeInTheDocument();
		expect(
			within(log).getByRole("link", { name: "[3] specs/column/spec.md" }),
		).toHaveAttribute("href", "/leitura/add-card-drag-drop");
		expect(within(log).getByText("Pensando…")).toBeInTheDocument();
		expect(screen.getByRole("article", { name: "Fonte 2" })).toHaveTextContent(
			"Requirement: Destino de soltura na coluna",
		);
	});

	test("marca o Assistente IA como página ativa no menu", () => {
		render(<Assistente />);

		expect(screen.getByRole("link", { name: /Assistente IA/ })).toHaveAttribute(
			"aria-current",
			"page",
		);
	});

	test("troca de conversa pela lista", () => {
		render(<Assistente />);

		const conversas = screen.getByRole("navigation", { name: "Conversas" });
		fireEvent.click(
			within(conversas).getByRole("button", {
				name: "Requisitos sem cenário",
			}),
		);

		expect(
			screen.getByRole("heading", { name: "Requisitos sem cenário" }),
		).toBeInTheDocument();
	});

	test("para a resposta em andamento e envia uma nova pergunta", () => {
		render(<Assistente />);

		fireEvent.click(screen.getByRole("button", { name: "Parar resposta" }));
		expect(screen.queryByText("Pensando…")).not.toBeInTheDocument();

		const enviar = screen.getByRole("button", { name: "Enviar" });
		expect(enviar).toBeDisabled();
		fireEvent.change(
			screen.getByRole("textbox", { name: "Mensagem para o assistente" }),
			{ target: { value: "Quem revisa add-swimlanes?" } },
		);
		fireEvent.click(enviar);

		expect(
			within(screen.getByRole("log")).getByText("Quem revisa add-swimlanes?"),
		).toBeInTheDocument();
	});
});
