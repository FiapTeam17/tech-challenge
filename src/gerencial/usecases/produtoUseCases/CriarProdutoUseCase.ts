import { ICriarProdutoUseCase, IProdutoRepositoryGateway } from "@gerencial/interfaces";
import { Logger } from "@tsed/common";
import { ProdutoCriarDto, ProdutoRetornoDto } from "@gerencial/dtos";
import { ProdutoEntity } from "@gerencial/entities";

export class CriarProdutoUseCase implements ICriarProdutoUseCase{
    constructor( 
        private produtoRepositoryGateway: IProdutoRepositoryGateway,
        private logger: Logger,
     ){}

    public async criar(dto: ProdutoCriarDto): Promise<ProdutoRetornoDto> {
        
        const produto = this.mapDtoToDomain(dto);

        produto.validar();
        const returnDto = await this.produtoRepositoryGateway.criar(dto);
        return returnDto;
    }

    private mapDtoToDomain(dto: ProdutoCriarDto): ProdutoEntity {
        return new ProdutoEntity(undefined, dto.nome, dto.descricao, dto.valor, dto.categoria, dto.imagem);
    }
    
}