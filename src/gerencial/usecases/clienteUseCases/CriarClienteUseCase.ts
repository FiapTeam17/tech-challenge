import { IClienteRepositoryGateway } from "@gerencial/interfaces";
import { Logger } from "@tsed/common";
import { ClienteDto, CriarClienteParamsDto, CriarClienteReturnDto } from "@gerencial/dtos";
import { ClienteExistenteException } from "@gerencial/usecases";
import { ClienteEntity } from "@gerencial/entities";

export class CriarClienteUseCase {

    constructor( 
        private clienteRepositoryGateway: IClienteRepositoryGateway,
        private logger: Logger  ){}
    async criar(dto: CriarClienteParamsDto): Promise<CriarClienteReturnDto> {
        this.logger.trace("Start dto={}", dto);

        const clienteReq = this.mapDtoToDomain(dto.cliente);

        clienteReq.validar();

        const clienteOp = await this.clienteRepositoryGateway.obterPorCpf(<string>clienteReq.cpf);

        if (!clienteOp.isEmpty()) {
            this.logger.warn("Cliente já existe no sistema.")
            throw new ClienteExistenteException();
        }

        const returnDto = await this.clienteRepositoryGateway.criar(dto);

        this.logger.trace("End returnDto={}", returnDto);
        return returnDto;
    }

    private mapDtoToDomain(dto: ClienteDto): ClienteEntity {
        return new ClienteEntity(dto.id, dto.nome, dto.cpf, dto.email);
    }

}