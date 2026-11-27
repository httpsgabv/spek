let baseUrl = "";

// No navegador o front usa caminho relativo (/api, via proxy). Quem chama do
// servidor (SSR) ou de outro repositório define a URL absoluta da API.
export function definirBaseUrl(url: string): void {
	baseUrl = url.replace(/\/$/, "");
}

// Resposta não-2xx vira exceção para o React Query tratar como erro;
// o corpo (ProblemDetail) fica em `problem`.
export class ErroApi extends Error {
	constructor(
		readonly status: number,
		readonly problem: unknown,
	) {
		super(`A API respondeu ${status}`);
		this.name = "ErroApi";
	}
}

export async function customFetch<T>(
	url: string,
	options: RequestInit,
): Promise<T> {
	const response = await fetch(`${baseUrl}${url}`, {
		credentials: "include",
		...options,
	});
	const corpo = [204, 205, 304].includes(response.status)
		? ""
		: await response.text();
	const data = corpo ? JSON.parse(corpo) : undefined;
	if (!response.ok) throw new ErroApi(response.status, data);
	return { data, status: response.status, headers: response.headers } as T;
}
