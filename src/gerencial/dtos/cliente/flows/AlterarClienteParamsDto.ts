import { ClienteDto } from "@gerencial/dtos";


export class AlterarClienteParamsDto {
    constructor(readonly cliente: ClienteDto) {}
}