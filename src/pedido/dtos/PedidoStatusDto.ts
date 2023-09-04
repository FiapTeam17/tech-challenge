import { Description, Enum, Example } from "@tsed/schema";
import { StatusPedido } from "@pedido/entities";
import { STATUS_PEDIDO } from "@pedido/types";

export class PedidoStatusDto {

    @Description("Categoria")
    @Example("PAGO")
    @Enum(STATUS_PEDIDO)
    public readonly status?: StatusPedido;
}
