import { IClienteRepositoryGateway, IObterClienteUseCase } from "@gerencial/interfaces";
import { Logger } from "@tsed/common";
import { Optional } from "typescript-optional";
import { ClienteRetornoDto, ClienteDto } from "@gerencial/dtos";
import { ClienteNaoEncontradoException } from "@gerencial/usecases";

export class ObterClienteUseCase implements  IObterClienteUseCase{
    constructor( 
       private clienteRepositoryGateway: IClienteRepositoryGateway,
       private logger: Logger
    ){}

    async obterPorId(id: number): Promise<ClienteRetornoDto> {
        const clienteOp = await this.clienteRepositoryGateway.obterPorId(id);
        const clienteDto = this.getClienteDto(clienteOp);
        return clienteDto;
    }

    async obterPorCpf(cpf: string): Promise<ClienteRetornoDto> {
        const clienteOp = await this.clienteRepositoryGateway.obterPorCpf(cpf);
        const clienteDto = this.getClienteDto(clienteOp);
        return clienteDto;
    }

    async obterPorEmail(email: string): Promise<ClienteRetornoDto> {
        const clienteOp = await this.clienteRepositoryGateway.obterPorEmail(email);
        const clienteDto = this.getClienteDto(clienteOp);
        return clienteDto;
    }

    private getClienteDto(clienteOp: Optional<ClienteDto>): ClienteRetornoDto {
        if (clienteOp.isEmpty()) {
            this.logger.warn("Cliente não encontrado");
            throw new ClienteNaoEncontradoException();
        }

        return clienteOp.get();
    }

}