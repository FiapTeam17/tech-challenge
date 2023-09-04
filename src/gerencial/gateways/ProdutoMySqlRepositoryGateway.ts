import { Optional } from "typescript-optional";
import { Logger } from "@tsed/common";
import { DataSource, Equal, Repository } from "typeorm";
import { ErrorToAccessDatabaseException } from "@common";
import { IProdutoRepositoryGateway } from "@gerencial/interfaces";
import { ProdutoModel } from "@gerencial/gateways/models";
import { ExclusaoProdutoAssociadoPedidoException } from "@gerencial/usecases";
import { ProdutoAlterarDto, ProdutoCriarDto, ProdutoRetornoDto } from "@gerencial/dtos";
import { ProdutoCategoriaEnum, ProdutoCategoriaEnumMapper } from "@gerencial/types";

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

    async obterPorId(id: number): Promise<Optional<ProdutoRetornoDto>> {
        try {
            this.logger.trace("Start id={}", id)
            const produtoEntity = await this.produtoRepository.findOneBy({ id: Equal(id) });


            let produtoOp: Optional<ProdutoRetornoDto> = Optional.empty();
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

    async obterPorCategoria(categoria: ProdutoCategoriaEnum): Promise<ProdutoRetornoDto[]> {
        try {
            const produtosEntities = await this.produtoRepository.findBy({
                categoria: Equal(ProdutoCategoriaEnumMapper.enumParaString(categoria))
            });
            const produtos = produtosEntities.map(pe => pe.getProdutoDto());

            return produtos;

        } catch (e) {
            this.logger.error(e);
            throw new ErrorToAccessDatabaseException();
        }
    }
    async criar(dto: ProdutoCriarDto): Promise<ProdutoRetornoDto> {
        try {
            const retornoDto = await this.produtoRepository.save(new ProdutoModel(dto));

            return retornoDto.getProdutoDto();

        } catch (e) {
            this.logger.error(e);
            throw new ErrorToAccessDatabaseException();
        }

    }
    async alterar(produto: ProdutoAlterarDto): Promise<ProdutoRetornoDto> {
        try {
            const retornoDto = await this.produtoRepository.save(new ProdutoModel(produto));
            return retornoDto.getProdutoDto();
        } catch (e) {
            this.logger.error(e);
            throw new ErrorToAccessDatabaseException();
        }

    }
}