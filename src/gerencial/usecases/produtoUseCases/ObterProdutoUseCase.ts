import { Logger } from "@tsed/common";
import { Optional } from "typescript-optional";
import { IObterProdutoUseCase, IProdutoRepositoryGateway } from "@gerencial/interfaces";
import { ProdutoDto } from "@gerencial/dtos";
import { ProdutoNotFoundException } from "@pedido/usecases";
import { ProdutoCategoriaEnumMapper } from "@gerencial/types";

export class ObterProdutoUseCase implements IObterProdutoUseCase{

    constructor(
        private produtoRepositoryGateway: IProdutoRepositoryGateway,
        private logger: Logger
    ) { }

    public async obterPorId(id: number): Promise<ProdutoDto> {
        this.logger.trace("Start id={}", id);

        const produtoFoundOp: Optional<ProdutoDto> = await this.produtoRepositoryGateway.obterPorId(id);
        if (produtoFoundOp.isEmpty()) {
            this.logger.warn("Produto not found: {}", id);
            throw new ProdutoNotFoundException();
        }

        const produtoFound = produtoFoundOp.get();
        this.logger.trace("End produto={}", produtoFound);
        return produtoFound;
    }

    public async obterPorCategoria(categoria: string): Promise<ProdutoDto[]> {
        this.logger.trace("Start categoria={}", categoria);
        const produtos = await this.produtoRepositoryGateway.obterPorCategoria(ProdutoCategoriaEnumMapper.stringParaEnum(categoria.toUpperCase()));
        this.logger.trace("End produtos={}", produtos);
        return produtos;
    }
}