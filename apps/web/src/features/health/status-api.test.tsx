import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { StatusApi } from "./status-api";

function renderizar() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	return render(
		<QueryClientProvider client={queryClient}>
			<StatusApi />
		</QueryClientProvider>,
	);
}

describe("Status da API", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	test("mostra Online quando a API responde ok", async () => {
		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockResolvedValue(
					new Response(JSON.stringify({ status: "ok" }), { status: 200 }),
				),
		);

		renderizar();

		expect(await screen.findByText("Online")).toBeInTheDocument();
	});

	test("mostra Fora do ar quando a API falha", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response("{}", { status: 503 })),
		);

		renderizar();

		expect(await screen.findByText("Fora do ar")).toBeInTheDocument();
	});
});
