import { Logger } from "@tsed/common";
import { Optional } from "typescript-optional";
import { IObterProdutoUseCase, IProdutoRepositoryGateway } from "@gerencial/interfaces";
import { ProdutoRetornoDto } from "@gerencial/dtos";
import { ProdutoNotFoundException } from "@pedido/usecases";
import { ProdutoCategoriaEnumMapper } from "@gerencial/types";

export class ObterProdutoUseCase implements IObterProdutoUseCase{

    constructor(
        private produtoRepositoryGateway: IProdutoRepositoryGateway,
        private logger: Logger
    ) { }

    public async obterPorId(id: number): Promise<ProdutoRetornoDto> {
        const produtoFoundOp: Optional<ProdutoRetornoDto> = await this.produtoRepositoryGateway.obterPorId(id);
        if (produtoFoundOp.isEmpty()) {
            throw new ProdutoNotFoundException();
        }

        const produtoFound = produtoFoundOp.get();
        return produtoFound;
    }

    public async obterPorCategoria(categoria: string): Promise<ProdutoRetornoDto[]> {
        const produtos = await this.produtoRepositoryGateway.obterPorCategoria(
          ProdutoCategoriaEnumMapper.stringParaEnum(categoria.toUpperCase()));
        return produtos;
    }
}