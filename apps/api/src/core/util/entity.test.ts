import { describe, expect, test } from "vitest";
import { Entity } from "./entity";
import { UniqueEntityId } from "./unique-entity-id";

class Exemplo extends Entity<{ nome: string }> {
	static criar(nome: string, id?: UniqueEntityId): Exemplo {
		return new Exemplo({ nome }, id);
	}
}

describe("Entity", () => {
	test("gera um UUID quando o id não é informado", () => {
		const exemplo = Exemplo.criar("a");

		expect(exemplo.id.value).toMatch(/^[0-9a-f-]{36}$/);
	});

	test("é igual a outra entidade com o mesmo id", () => {
		const id = new UniqueEntityId();

		expect(Exemplo.criar("a", id).equals(Exemplo.criar("b", id))).toBe(true);
		expect(Exemplo.criar("a").equals(Exemplo.criar("a"))).toBe(false);
	});
});
