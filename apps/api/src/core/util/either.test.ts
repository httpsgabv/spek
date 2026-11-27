import { describe, expect, test } from "vitest";
import { type Either, failure, success } from "./either";

function dividir(a: number, b: number): Either<string, number> {
	return b === 0 ? failure("divisão por zero") : success(a / b);
}

describe("Either", () => {
	test("retorna sucesso com o valor", () => {
		const resultado = dividir(10, 2);

		expect(resultado.isSuccess()).toBe(true);
		expect(resultado.isFailure()).toBe(false);
		expect(resultado.value).toBe(5);
	});

	test("retorna falha com o erro", () => {
		const resultado = dividir(10, 0);

		expect(resultado.isFailure()).toBe(true);
		expect(resultado.isSuccess()).toBe(false);
		expect(resultado.value).toBe("divisão por zero");
	});
});
