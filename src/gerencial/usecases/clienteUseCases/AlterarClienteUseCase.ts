import { IClienteRepositoryGateway } from "@gerencial/interfaces";
import { Logger } from "@tsed/common";
import { AlterarClienteParamsDto, AlterarClienteReturnDto, ClienteDto } from "@gerencial/dtos";
import { ClienteNaoEncontradoException } from "@gerencial/usecases";
import { ClienteEntity } from "@gerencial/entities";

export class AlterarClienteUseCase {

    constructor( 
        private clienteRepositoryGateway: IClienteRepositoryGateway,
        private logger: Logger
     ){}
    
    async alterar(paramsDto: AlterarClienteParamsDto): Promise<AlterarClienteReturnDto> {
        this.logger.trace("Start requestDto={}", paramsDto);

        const cliente = this.mapDtoToDomain(paramsDto.cliente);

        cliente.validar();

        const clienteOp = await this.clienteRepositoryGateway.obterPorCpf(<string>cliente.cpf);
        
        if (clienteOp.isEmpty()) {
            this.logger.warn("Cliente não encontardo!");
            throw new ClienteNaoEncontradoException();
        }
        
        const returnDto = await this.clienteRepositoryGateway.alterar(paramsDto);
        
        this.logger.trace("End returnDto={}", returnDto);
        return returnDto;
    }

    private mapDtoToDomain(dto: ClienteDto): ClienteEntity {
        return new ClienteEntity(dto.id, dto.nome, dto.cpf, dto.email);
    }
}
