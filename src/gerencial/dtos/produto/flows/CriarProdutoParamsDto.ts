import { ProdutoDto } from "@gerencial/dtos";

export class CriarProdutoParamsDto {
    constructor(readonly produto: ProdutoDto){}
}