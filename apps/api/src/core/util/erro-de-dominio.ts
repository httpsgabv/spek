// Base de todo erro de regra de negócio. O use case devolve o erro em
// failure(); o controller relança e o filtro global responde com `status`.
export abstract class ErroDeDominio extends Error {
	abstract readonly codigo: string;
	abstract readonly status: number;

	constructor(mensagem: string) {
		super(mensagem);
		this.name = new.target.name;
	}
}
