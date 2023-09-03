import { IClienteRepositoryGateway, ICriarClienteUseCase } from "@gerencial/interfaces";
import { Logger } from "@tsed/common";
import { ClienteCriarDto, ClienteRetornoDto } from "@gerencial/dtos";
import { ClienteExistenteException } from "@gerencial/usecases";
import { ClienteEntity } from "@gerencial/entities";

export class CriarClienteUseCase implements ICriarClienteUseCase{

    constructor( 
        private clienteRepositoryGateway: IClienteRepositoryGateway,
        private logger: Logger  ){}
    async criar(dto: ClienteCriarDto): Promise<ClienteRetornoDto> {

        const clienteReq = this.mapDtoToDomain(dto);

        clienteReq.validar();

        const clienteOp = await this.clienteRepositoryGateway.obterPorCpf(<string>clienteReq.cpf);

        if (!clienteOp.isEmpty()) {
            this.logger.warn("Cliente já existe no sistema.")
            throw new ClienteExistenteException();
        }

        const returnDto = await this.clienteRepositoryGateway.criar(dto);
        return returnDto;
    }

    private mapDtoToDomain(dto: ClienteCriarDto): ClienteEntity {
        return new ClienteEntity(undefined, dto.nome, dto.cpf, dto.email);
    }

}