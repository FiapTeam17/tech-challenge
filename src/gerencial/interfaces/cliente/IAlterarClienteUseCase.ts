import { AlterarClienteParamsDto, AlterarClienteReturnDto } from "@gerencial/dtos";

export const IAlterarClienteUseCase: unique symbol = Symbol("IAlterarClienteUseCase");

export interface IAlterarClienteUseCase {
    alterar(requestDto: AlterarClienteParamsDto): Promise<AlterarClienteReturnDto>;
}