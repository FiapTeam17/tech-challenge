import { SystemBaseException } from "@common";

export class PedidoNotFoundException extends SystemBaseException {
    public readonly code = "sgr.pedidoNotFound";
    public readonly message = "Pedido não foi encontrado";
    public readonly httpStatus = 404;
}