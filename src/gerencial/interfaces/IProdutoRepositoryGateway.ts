import { Optional } from "typescript-optional";
import { ProdutoCategoriaEnum } from "../types";
import { ProdutoDto } from "@gerencial/dtos";

export const IProdutoRepositoryGateway: unique symbol = Symbol("IProdutoRepositoryGateway");

export interface IProdutoRepositoryGateway {
    obterPorId(produtoId: number): Promise<Optional<ProdutoDto>>;
    obterPorCategoria(categoria: ProdutoCategoriaEnum): Promise<ProdutoDto[]>;
    criar(produto: ProdutoDto): Promise<number>;
    alterar(produto: ProdutoDto): Promise<void>;
    excluir(produtoId: number): Promise<void>;
}