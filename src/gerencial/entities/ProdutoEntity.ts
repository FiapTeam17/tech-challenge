import { ProdutoCategoriaEnum } from "@gerencial/types";
import { ProdutoValidacaoException } from "@gerencial/usecases";

export class ProdutoEntity {
    constructor(
      readonly id?: number,
        readonly nome?: string,
        readonly descricao?: string,
        readonly valor?: number,
        readonly categoria?: ProdutoCategoriaEnum,
        readonly imagem?: string
    ){}

     validar(){
        if(!this.nome){
            throw new ProdutoValidacaoException("Nome é obrigatório");
        }else if(!this.valor){
            throw new ProdutoValidacaoException("Valor é obrigatório");
        }
        else if(!this.categoria === undefined){
            throw new ProdutoValidacaoException("Categoria é obrigatória");
        }
    }
}