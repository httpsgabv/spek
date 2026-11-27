import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, test, vi } from "vitest";
import { Dashboard } from "./dashboard";

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

describe("Dashboard", () => {
	test("mostra indicadores, gráficos, changes e atividade", () => {
		render(<Dashboard />);

		expect(
			screen.getByRole("heading", { name: "Dashboard" }),
		).toBeInTheDocument();
		expect(screen.getByText("Changes ativas")).toBeInTheDocument();
		expect(screen.getByText("Tasks concluídas por semana")).toBeInTheDocument();
		expect(screen.getByText("Changes por estágio")).toBeInTheDocument();
		expect(screen.getByText("add-card-drag-drop")).toBeInTheDocument();
		expect(screen.getByText("Atividade recente")).toBeInTheDocument();
	});

	test("marca o Dashboard como página ativa no menu", () => {
		render(<Dashboard />);

		expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
			"aria-current",
			"page",
		);
	});
});
