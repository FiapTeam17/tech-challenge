import { SystemBaseException } from "@common";

export class ErrorToAccessPedidoServiceException extends SystemBaseException {
    public readonly code = "sgr.errorToAccessPedidoService";
    public readonly message = "Erro ao acessar pedido service";
    public readonly httpStatus = 500;
}