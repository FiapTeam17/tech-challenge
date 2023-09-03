import { ProdutoCriarDto, ProdutoRetornoDto } from "@gerencial/dtos";

export const ICriarProdutoUseCase: unique symbol = Symbol("ICriarProdutoUseCase");

export interface ICriarProdutoUseCase {
    criar(dto: ProdutoCriarDto): Promise<ProdutoRetornoDto>;
}