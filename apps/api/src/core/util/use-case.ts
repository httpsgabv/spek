export interface UseCase<Entrada, Resultado> {
	executar(entrada: Entrada): Promise<Resultado>;
}
