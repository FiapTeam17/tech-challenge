import { Optional } from "typescript-optional";
import { ProdutoCategoriaEnum } from "../../types";
import { ProdutoAlterarDto, ProdutoCriarDto, ProdutoRetornoDto } from "@gerencial/dtos";

export const IProdutoRepositoryGateway: unique symbol = Symbol("IProdutoRepositoryGateway");

export interface IProdutoRepositoryGateway {
    obterPorId(produtoId: number): Promise<Optional<ProdutoRetornoDto>>;
    obterPorCategoria(categoria: ProdutoCategoriaEnum): Promise<ProdutoRetornoDto[]>;
    criar(produto: ProdutoCriarDto): Promise<ProdutoRetornoDto>;
    alterar(produto: ProdutoAlterarDto): Promise<ProdutoRetornoDto>;
    excluir(produtoId: number): Promise<void>;
}