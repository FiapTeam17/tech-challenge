import { Description, Example, Property } from "@tsed/schema";
import { PedidoRetornoDto } from "@pedido/dtos/PedidoRetornoDto";

export class PedidoCriarRetornoDto extends PedidoRetornoDto{
    @Description("QrCode do Mercado Pago")
    @Example("00020101021243650016COM.MERCADOLIBRE02013063638f1192a-5fd1-4180-a180-8bcae3556bc35204000053039865802BR5925IZABEL AAAA DE MELO6007BARUERI62070503***63040B6D")
    @Property()
    public readonly qrCodeMercadoPago: string;

}
