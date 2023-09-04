import { ClienteAlterarDto, ClienteRetornoDto, ClienteDto } from "@gerencial/dtos/cliente";
import { Optional } from "typescript-optional";

export const IClienteRepositoryGateway: unique symbol = Symbol("IClienteRepositoryGateway");

export interface IClienteRepositoryGateway {
    obterPorId(id: number): Promise<Optional<ClienteRetornoDto>>;
    obterPorCpf(cpf: string): Promise<Optional<ClienteRetornoDto>>;
    obterPorEmail(email: string): Promise<Optional<ClienteRetornoDto>>;
    criar(dto: ClienteDto): Promise<ClienteRetornoDto>;
    alterar(dto: ClienteAlterarDto): Promise<ClienteRetornoDto>;
}
