import { SystemBaseException } from "../../../../common/exception/SystemBaseException";

export class ErrorToPagamentoPendente extends SystemBaseException {
    public readonly code = "sgr.erroPagamentoPendente";
    public readonly message = "Pagamento está pendente ainda";
    public readonly httpStatus = 500;
}