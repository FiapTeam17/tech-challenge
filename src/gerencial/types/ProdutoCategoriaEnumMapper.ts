import { ProdutoCategoriaEnum } from "@gerencial/types";
import { Exception } from "@tsed/exceptions";


export class ProdutoCategoriaEnumMapper {
    static numberParaEnum(codigo?: number): ProdutoCategoriaEnum{
        switch (codigo){
            case 0:
                return ProdutoCategoriaEnum.LANCHE;
            case 1:
                return ProdutoCategoriaEnum.ACOMPANHAMENTO;
            case 2:
                return ProdutoCategoriaEnum.BEBIDA;
            case 3:
                return ProdutoCategoriaEnum.SOBREMESA;
            default:
                throw new Exception(500,"Categoria Inválida");
        }
    }

    static stringParaEnum(opcao?: string): ProdutoCategoriaEnum{
        switch (opcao){
            case "LANCHE":
                return ProdutoCategoriaEnum.LANCHE;
            case "ACOMPANHAMENTO":
                return ProdutoCategoriaEnum.ACOMPANHAMENTO;
            case "BEBIDA":
                return ProdutoCategoriaEnum.BEBIDA;
            case "SOBREMESA":
                return ProdutoCategoriaEnum.SOBREMESA;
            default:
                throw new Exception(500,"Categoria Inválida");
        }
    }

    static stringParaNumber(opcao?: string): number {
        switch (opcao){
            case "LANCHE":
                return 0;
            case "ACOMPANHAMENTO":
                return 1;
            case "BEBIDA":
                return 2;
            case "SOBREMESA":
                return 3;
            default:
                throw new Exception(500,"Categoria Inválida");
        }
    }


    static enumParaString(categoria? : ProdutoCategoriaEnum): string {

        switch (categoria){
        case ProdutoCategoriaEnum.LANCHE:
            return "LANCHE";
        case ProdutoCategoriaEnum.ACOMPANHAMENTO:
            return "ACOMPANHAMENTO";
        case ProdutoCategoriaEnum.BEBIDA:
            return "BEBIDA";
        case ProdutoCategoriaEnum.SOBREMESA:
            return "SOBREMESA";
        }

        throw new Exception(500,"Categoria Inválida");
    }
}

