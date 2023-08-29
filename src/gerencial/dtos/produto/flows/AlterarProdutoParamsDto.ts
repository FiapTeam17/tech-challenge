import { ProdutoDto } from "@gerencial/dtos";

export class AlterarProdutoParamsDto {
    constructor(public readonly produto: ProdutoDto){}
}