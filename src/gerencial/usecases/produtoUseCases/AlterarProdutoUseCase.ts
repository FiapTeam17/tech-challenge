import { Logger } from "@tsed/common";
import { IAlterarProdutoUseCase, IProdutoRepositoryGateway } from "@gerencial/interfaces";
import { ProdutoAlterarDto, ProdutoCriarDto, ProdutoRetornoDto } from "@gerencial/dtos";
import { ProdutoEntity } from "@gerencial/entities";

export class AlterarProdutoUseCase implements IAlterarProdutoUseCase{
    constructor( 
        private produtoRepositoryGateway: IProdutoRepositoryGateway,
        private logger: Logger){}

    public async alterar(dto: ProdutoAlterarDto): Promise<ProdutoRetornoDto> {
        const produto = this.mapDtoToDomain(dto);

        produto.validar();

        const returnDto = await this.produtoRepositoryGateway.alterar(dto);
        return returnDto;
    }

    private mapDtoToDomain(dto: ProdutoCriarDto): ProdutoEntity {
        return new ProdutoEntity(undefined, dto.nome, dto.descricao, dto.valor, dto.categoria, dto.imagem);
    }
}