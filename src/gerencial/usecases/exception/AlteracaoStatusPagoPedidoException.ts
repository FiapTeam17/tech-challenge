import { SystemBaseException } from "@common";

export class AlteracaoStatusPedidoException extends SystemBaseException {
    public readonly code = "sgr.alteracaoStatus";
    public readonly httpStatus = 422;

    constructor(public message: string){
        super();
    }

}