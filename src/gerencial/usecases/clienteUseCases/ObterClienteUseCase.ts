import { IClienteRepositoryGateway } from "@gerencial/interfaces";
import { Logger } from "@tsed/common";
import { Optional } from "typescript-optional";
import { ClienteDto } from "@gerencial/dtos";
import { ClienteNaoEncontradoException } from "@gerencial/usecases";

export class ObterClienteUseCase {
    constructor( 
       private clienteRepositoryGateway: IClienteRepositoryGateway,
       private logger: Logger
    ){}

    async obterPorId(id: number): Promise<ClienteDto> {
        this.logger.trace("Start id={}", id);
        const clienteOp = await this.clienteRepositoryGateway.obterPorId(id);
        const clienteDto = this.getClienteDto(clienteOp);
        this.logger.trace("End clienteDto={}", clienteDto);
        return clienteDto;
    }

    async obterPorCpf(cpf: string): Promise<ClienteDto> {
        this.logger.trace("Start cpf={}", cpf);
        const clienteOp = await this.clienteRepositoryGateway.obterPorCpf(cpf);
        const clienteDto = this.getClienteDto(clienteOp);
        this.logger.trace("End clienteDto={}", clienteDto);
        return clienteDto;
    }

    async obterPorEmail(email: string): Promise<ClienteDto> {
        this.logger.trace("Start email={}", email);
        const clienteOp = await this.clienteRepositoryGateway.obterPorEmail(email);
        const clienteDto = this.getClienteDto(clienteOp);
        this.logger.trace("End clienteDto={}", clienteDto);
        return clienteDto;
    }

    private getClienteDto(clienteOp: Optional<ClienteDto>): ClienteDto {
        if (clienteOp.isEmpty()) {
            this.logger.warn("Cliente não encontrado");
            throw new ClienteNaoEncontradoException();
        }

        return clienteOp.get();
    }

}