import { Logger } from "@tsed/common";
import { IProdutoRepositoryGateway } from "@gerencial/interfaces";
import { AlterarProdutoParamsDto, AlterarProdutoReturnDto } from "@gerencial/dtos";

export class AlterarProdutoUseCase {
    constructor( 
        private produtoRepositoryGateway: IProdutoRepositoryGateway,
        private logger: Logger){}

    public async alterar(dto: AlterarProdutoParamsDto): Promise<AlterarProdutoReturnDto> {
        this.logger.trace("Start dto={}", dto);
        await this.produtoRepositoryGateway.alterar(dto.produto);
        const returnDto = new AlterarProdutoReturnDto();
        this.logger.trace("End returnDto={}", returnDto);
        return returnDto;
    }
}