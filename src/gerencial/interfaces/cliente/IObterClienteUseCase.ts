import { ClienteRetornoDto } from "@gerencial/dtos";

export const IObterClienteUseCase: unique symbol = Symbol("IObterClienteUseCase");

export interface IObterClienteUseCase {
    obterPorId(id: number): Promise<ClienteRetornoDto>;
    obterPorCpf(cpf: string): Promise<ClienteRetornoDto>;
    obterPorEmail(email: string): Promise<ClienteRetornoDto>;
}