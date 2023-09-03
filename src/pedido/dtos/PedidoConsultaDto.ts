import { CollectionOf, Description, Enum, Example, Property } from "@tsed/schema";
import { OnSerialize } from "@tsed/json-mapper";
import { StatusPedido } from "@pedido/entities";
import { StatusPedidoEnumMapper } from "@pedido/types";
import { PedidoDto, PedidoItemDto } from "@pedido/dtos/PedidoDto";

export class PedidoItemConsultaDto {
    @Description("Identificador")
    @Example("123456")
    @Property()
    public readonly id?: number;

    @Description("Quantidade do Item")
    @Example("5")
    @Property()
    public quantidade?: number;

    @Description("Valor Unitário do Item")
    @Example("5.6")
    @Property()
    public valorUnitario?: number;

    @Description("Valor Total do Item")
    @Example("5.6")
    @Property()
    public valorTotal?: number;

    @Description("Identificador do Produto")
    @Example("123456")
    @Property()
    public produtoId?: number
}

export class PedidoConsultaDto {
    @Description("Identificador")
    @Example("123456")
    @Property()
    public readonly id?: number;

    @Description("Observação")
    @Example("Sem cebola")
    @Property()
    public readonly observacao?: string;

    @Description("Cliente")
    @Example("123456")
    @Property()
    public readonly clienteId?: number;

    @Description("Categoria")
    @Example("RECEBIDO")
    @Enum("RECEBIDO", "AGUARDANDO_CONFIRMACAO_PAGAMENTO", "PAGO", "EM_PREPARACAO", "PRONTO", "FINALIZADO", "PAGAMENTO_INVALIDO")
    @OnSerialize((c: StatusPedido) => StatusPedidoEnumMapper.enumParaString(c))
    public readonly status?: StatusPedido;

    @Description("Itens do Pedido")
    @CollectionOf(PedidoItemConsultaDto)
    public readonly itens: PedidoItemConsultaDto[];

    @Description("QrCode do Mercado Pago")
    @Example("00020101021243650016COM.MERCADOLIBRE02013063638f1192a-5fd1-4180-a180-8bcae3556bc35204000053039865802BR5925IZABEL AAAA DE MELO6007BARUERI62070503***63040B6D")
    @Property()
    public readonly qrCodeMercadoPago?: string;

    static getInstance(pedido: PedidoDto): PedidoConsultaDto {
        return {
            id: pedido.id,
            observacao: pedido.observacao,
            cliente: pedido.cliente,
            status: pedido.status,
            itens: pedido.itens?.map(i => PedidoConsultaDto.getItemInstance(i)),
            qrCodeMercadoPago: pedido.qrDataMercadoPago
        } as PedidoConsultaDto;
    }

    private static getItemInstance(item: PedidoItemDto): PedidoItemConsultaDto {
        return {
            id: item.id,
            produtoId: item.produto?.id,
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario,
            valorTotal: item.valorTotal
        }
    }
}
