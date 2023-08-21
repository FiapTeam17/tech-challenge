import { Description, Example, Property } from "@tsed/schema";

export class PedidoPagamentoDto {
    @Description("IdPedido")
    @Example("123456")
    @Property()
    public readonly IdPedido: number;

    @Description("Aprovação do Pagamento do Pedido")
    @Example("Sim")
    @Property()
    public foiAprovado: boolean;

    constructor(
        idPedido: number,
        foiAprovado: boolean
    ) {
        this.IdPedido = idPedido;
        this.foiAprovado = foiAprovado;
    }
}
