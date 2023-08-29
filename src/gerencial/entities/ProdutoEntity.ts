import { ProdutoCategoriaEnum } from "@gerencial/types";

export class ProdutoEntity {
    constructor(
        readonly id?: number,
        readonly nome?: string,
        readonly descricao?: string,
        readonly valor?: number,
        readonly categoria?: ProdutoCategoriaEnum,
        readonly imagem?: string
    ){}
}