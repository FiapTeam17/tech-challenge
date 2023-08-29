import { IProdutoRepositoryGateway } from "@gerencial/interfaces";
import { Logger } from "@tsed/common";
import { CriarProdutoParamsDto, CriarProdutoReturnDto, ProdutoDto } from "@gerencial/dtos";
import { ProdutoValidacaoException } from "@gerencial/usecases";

export class CriarProdutoUseCase {
    constructor( 
        private produtoRepositoryGateway: IProdutoRepositoryGateway,
        private logger: Logger,
     ){}

    public async criar(dto: CriarProdutoParamsDto): Promise<CriarProdutoReturnDto> {
        this.logger.trace("Start dto={}", dto);

        this.validar(dto.produto);

        const id = await this.produtoRepositoryGateway.criar(dto.produto);
        const returnDto = new CriarProdutoReturnDto(id);
        this.logger.trace("End returnDto={}", returnDto);
        return returnDto;
    }

    private validar(produtoDto: ProdutoDto){
        if(!produtoDto.nome){
            this.logger.warn("Nome é obrigatório");
            throw new ProdutoValidacaoException("Nome é obrigatório");
        }else if(!produtoDto.valor){
            this.logger.warn("Valor é obrigatório");
            throw new ProdutoValidacaoException("Valor é obrigatório");
        }
        else if(!produtoDto.categoriaId === undefined){
            this.logger.warn("Categoria é obrigatória");
            throw new ProdutoValidacaoException("Categoria é obrigatória");
        }
    }
}