import { IAlterarClienteUseCase, IClienteRepositoryGateway } from "@gerencial/interfaces";
import { Logger } from "@tsed/common";
import { ClienteAlterarDto, ClienteRetornoDto } from "@gerencial/dtos";
import { ClienteEntity } from "@gerencial/entities";

export class AlterarClienteUseCase implements IAlterarClienteUseCase{

    constructor( 
        private clienteRepositoryGateway: IClienteRepositoryGateway,
        private logger: Logger
     ){}
    
    async alterar(paramsDto: ClienteAlterarDto): Promise<ClienteRetornoDto> {
        this.logger.trace("Start requestDto={}", paramsDto);

        const cliente = this.mapDtoToDomain(paramsDto);

        cliente.validar();
        
        const returnDto = await this.clienteRepositoryGateway.alterar(paramsDto);
        
        this.logger.trace("End returnDto={}", returnDto);
        return returnDto;
    }

    private mapDtoToDomain(dto: ClienteAlterarDto): ClienteEntity {
        return new ClienteEntity(dto.id, dto.nome, dto.cpf, dto.email);
    }
}
