import { GitActivityFeed } from "@spek/ui/components/git-activity-feed";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeAll, describe, expect, test, vi } from "vitest";
import { Atividade } from "./atividade";
import { dias } from "./dados-exemplo";

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

describe("Atividade", () => {
	test("mostra os commits por dia, as branches ativas e os contribuidores", () => {
		render(<Atividade />);

		expect(
			screen.getByRole("heading", { name: "Atividade" }),
		).toBeInTheDocument();
		const hoje = screen.getByRole("region", { name: "Hoje" });
		expect(
			within(hoje).getByText("feat(card): drop entre colunas com reordenação"),
		).toBeInTheDocument();
		expect(
			screen.getByRole("region", { name: "20 de novembro" }),
		).toBeInTheDocument();
		expect(screen.getByText("Branches ativas")).toBeInTheDocument();
		expect(
			screen.getByText("add-board-filters · 5 commits atrás de main"),
		).toBeInTheDocument();
		expect(
			screen.getByRole("progressbar", { name: "Commits de Ana Lima" }),
		).toBeInTheDocument();
	});

	test("marca a Atividade como página ativa no menu", () => {
		render(<Atividade />);

		expect(screen.getByRole("link", { name: /Atividade/ })).toHaveAttribute(
			"aria-current",
			"page",
		);
	});

	test("filtra os commits por tipo", () => {
		render(<Atividade />);

		fireEvent.click(screen.getByRole("radio", { name: "Código" }));

		expect(
			screen.getByText("feat(card): drop entre colunas com reordenação"),
		).toBeInTheDocument();
		expect(
			screen.queryByText("tasks: marca 2.1 e 2.2 como concluídas"),
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole("region", { name: "Ontem" }),
		).not.toBeInTheDocument();
	});

	test("filtra os commits por branch e avisa quando nada atende", () => {
		const { rerender } = render(
			<GitActivityFeed days={dias} branch="feat/wip-limits" />,
		);
		expect(
			screen.getByText("spec: cenário de limite WIP excedido"),
		).toBeInTheDocument();
		expect(screen.getAllByRole("listitem")).toHaveLength(1);

		rerender(
			<GitActivityFeed days={dias} branch="feat/wip-limits" filter="codigo" />,
		);

		expect(
			screen.getByText("Nenhum commit com esses filtros."),
		).toBeInTheDocument();
	});
});
