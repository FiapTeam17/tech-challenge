import { CriarClienteParamsDto, CriarClienteReturnDto } from "@gerencial/dtos";

export const ICriarClienteUseCase: unique symbol = Symbol("ICriarClienteUseCase");

export interface ICriarClienteUseCase {
    criar(dto: CriarClienteParamsDto): Promise<CriarClienteReturnDto>;
}