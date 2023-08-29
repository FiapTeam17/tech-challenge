import { Description, Enum, Example } from "@tsed/schema";
import { StatusPedido } from "@pedido/entities";

export class PedidoStatusDto {

    @Description("Categoria")
    @Example("PAGO")
    @Enum("AGUARDANDO_CONFIRMACAO_PAGAMENTO", "RECEBIDO", "EM_PREPARACAO", "PRONTO", "FINALIZADO")
    public readonly status?: StatusPedido;
}
