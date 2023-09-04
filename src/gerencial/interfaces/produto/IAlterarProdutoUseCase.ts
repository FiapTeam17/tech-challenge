import { ProdutoAlterarDto, ProdutoRetornoDto } from "@gerencial/dtos";

export const IAlterarProdutoUseCase: unique symbol = Symbol("IAlterarProdutoUseCase");

export interface IAlterarProdutoUseCase {
    alterar(dto: ProdutoAlterarDto): Promise<ProdutoRetornoDto>;
}