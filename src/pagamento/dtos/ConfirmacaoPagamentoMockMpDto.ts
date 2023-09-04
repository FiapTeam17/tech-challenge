import { Description, Example, Property } from "@tsed/schema";
import { ConfirmacaoPagamentoMpDto } from "@pagamento/dtos/ConfirmacaoPagamentoMpDto";

export class ConfirmacaoPagamentoMockMpDto extends ConfirmacaoPagamentoMpDto{
    @Description("Id do pedido para confirmar o pagamento")
    @Example("123")
    @Property()
    pedidoId?: number;

}

