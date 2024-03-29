import { SystemBaseException } from "@common";

export class CamposObrigatoriosNaoPreechidoException extends SystemBaseException {
    public readonly code = "sgr.camposObrigatoriosNaoPreenchido";
    public readonly httpStatus = 400;

    constructor(public readonly message: string){
        super();
    }
}