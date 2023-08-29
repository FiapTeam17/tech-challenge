import { Optional } from "typescript-optional";
import { Logger } from "@tsed/common";
import { DataSource, Equal, Repository } from "typeorm";
import { ErrorToAccessDatabaseException } from "@common";
import { IProdutoRepositoryGateway } from "@gerencial/interfaces";
import { ProdutoModel } from "@gerencial/gateways/models";
import { ExclusaoProdutoAssociadoPedidoException } from "@gerencial/usecases";
import { ProdutoDto } from "@gerencial/dtos";
import { ProdutoCategoriaEnum } from "@gerencial/types";

export class ProdutoMySqlRepositoryGateway implements IProdutoRepositoryGateway {

    private produtoRepository: Repository<ProdutoModel>;

    constructor(
      private dataSource: DataSource,
      private logger: Logger
    ) {
        this.produtoRepository = this.dataSource.getRepository(ProdutoModel);
    }

    async excluir(id: number): Promise<void> {
        try {
            this.logger.trace("Start id={}", id)

            await this.produtoRepository.delete(id);
            this.logger.trace("End")
        }
        catch (e) {
            //TODO: este if deve ser removido assim que o usecase de exclusão verificar a associação de pedido x produto
            if(e.code === 'ER_ROW_IS_REFERENCED_2'){
                throw new ExclusaoProdutoAssociadoPedidoException();
            }

            this.logger.error(e);
            throw new ErrorToAccessDatabaseException();
        }
    }

    async obterPorId(id: number): Promise<Optional<ProdutoDto>> {
        try {
            this.logger.trace("Start id={}", id)
            const produtoEntity = await this.produtoRepository.findOneBy({ id: Equal(id) });


            let produtoOp: Optional<ProdutoDto> = Optional.empty();
            if (produtoEntity !== null) {
                produtoOp = Optional.of(produtoEntity.getProdutoDto());
            }

            this.logger.trace("End produtoOp={}", produtoOp)
            return produtoOp;

        } catch (e) {
            this.logger.error(e);
            throw new ErrorToAccessDatabaseException();
        }
    }

    async obterPorCategoria(categoria: ProdutoCategoriaEnum): Promise<ProdutoDto[]> {
        try {
            this.logger.trace("Start categoria={}", categoria)
            const produtosEntities = await this.produtoRepository.findBy({ categoriaId: Equal(categoria) });
            const produtos = produtosEntities.map(pe => pe.getProdutoDto());

            this.logger.trace("End produtos={}", produtos)
            return produtos;

        } catch (e) {
            this.logger.error(e);
            throw new ErrorToAccessDatabaseException();
        }
    }
    async criar(dto: ProdutoDto): Promise<number> {
        try {
            this.logger.trace("Start dto={}", dto)
            const produtoSavedEntity = await this.produtoRepository.save(new ProdutoModel(dto));
            const idProdutoCreated = produtoSavedEntity.id;
            this.logger.trace("End idProdutoCreated={}", idProdutoCreated);
            return idProdutoCreated as number;

        } catch (e) {
            this.logger.error(e);
            throw new ErrorToAccessDatabaseException();
        }

    }
    async alterar(produto: ProdutoDto): Promise<void> {
        try {
            this.logger.trace("Start produto={}", produto)
            await this.produtoRepository.save(new ProdutoModel(produto));
            this.logger.trace("End");

        } catch (e) {
            this.logger.error(e);
            throw new ErrorToAccessDatabaseException();
        }

    }
}