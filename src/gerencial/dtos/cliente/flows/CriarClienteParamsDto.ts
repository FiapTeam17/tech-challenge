import { ClienteDto } from "@gerencial/dtos";


export class CriarClienteParamsDto {
    constructor(readonly cliente: ClienteDto) {}
}