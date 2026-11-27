import { randomUUID } from "node:crypto";

export class UniqueEntityId {
	readonly value: string;

	constructor(value?: string) {
		this.value = value ?? randomUUID();
	}

	toString(): string {
		return this.value;
	}

	equals(id: UniqueEntityId): boolean {
		return id.value === this.value;
	}
}
