import { AlterarProdutoParamsDto, AlterarProdutoReturnDto } from "@gerencial/dtos";

export const IAlterarProdutoUseCase: unique symbol = Symbol("IAlterarProdutoUseCase");

export interface IAlterarProdutoUseCase {
    alterar(dto: AlterarProdutoParamsDto): Promise<AlterarProdutoReturnDto>;
}