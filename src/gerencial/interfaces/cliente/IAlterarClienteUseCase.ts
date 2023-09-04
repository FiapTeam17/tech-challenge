import { ClienteRetornoDto } from "@gerencial/dtos";
import { ClienteAlterarDto } from "@gerencial/dtos/cliente/ClienteAlterarDto";

export const IAlterarClienteUseCase: unique symbol = Symbol("IAlterarClienteUseCase");

export interface IAlterarClienteUseCase {
    alterar(requestDto: ClienteAlterarDto): Promise<ClienteRetornoDto>;
}