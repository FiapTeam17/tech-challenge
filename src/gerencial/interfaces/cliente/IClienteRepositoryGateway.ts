import {
    AlterarClienteParamsDto,
    AlterarClienteReturnDto,
    ClienteDto, CriarClienteParamsDto,
    CriarClienteReturnDto
} from "@gerencial/dtos/cliente";
import { Optional } from "typescript-optional";

export const IClienteRepositoryGateway: unique symbol = Symbol("IClienteRepositoryGateway");

export interface IClienteRepositoryGateway {
    obterPorId(id: number): Promise<Optional<ClienteDto>>;
    obterPorCpf(cpf: string): Promise<Optional<ClienteDto>>;
    obterPorEmail(email: string): Promise<Optional<ClienteDto>>;
    criar(dto: CriarClienteParamsDto): Promise<CriarClienteReturnDto>;
    alterar(dto: AlterarClienteParamsDto): Promise<AlterarClienteReturnDto>;
}
