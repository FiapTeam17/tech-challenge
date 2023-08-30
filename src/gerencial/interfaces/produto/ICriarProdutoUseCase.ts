import { CriarProdutoParamsDto, CriarProdutoReturnDto } from "@gerencial/dtos";

export const ICriarProdutoUseCase: unique symbol = Symbol("ICriarProdutoUseCase");

export interface ICriarProdutoUseCase {
    criar(dto: CriarProdutoParamsDto): Promise<CriarProdutoReturnDto>;
}