import { CollectionOf, Description, Enum, Example, Property } from "@tsed/schema";
import { OnSerialize } from "@tsed/json-mapper";
import { StatusPedido } from "@pedido/entities";
import { STATUS_PEDIDO, StatusPedidoEnumMapper } from "@pedido/types";
import { PedidoDto, PedidoItemDto } from "@pedido/dtos/PedidoDto";

export class PedidoItemRetornoDto {
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

export class PedidoRetornoDto {
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
    @Enum(STATUS_PEDIDO)
    @OnSerialize((c: StatusPedido) => StatusPedidoEnumMapper.enumParaString(c))
    public readonly status?: StatusPedido;

    @Description("Itens do Pedido")
    @CollectionOf(PedidoItemRetornoDto)
    public readonly itens: PedidoItemRetornoDto[];

    static getInstance(pedido: PedidoDto): PedidoRetornoDto {
        return {
            id: pedido.id,
            observacao: pedido.observacao,
            cliente: pedido.cliente,
            status: pedido.status,
            itens: pedido.itens?.map(i => PedidoRetornoDto.getItemInstance(i)),
        } as PedidoRetornoDto;
    }

    private static getItemInstance(item: PedidoItemDto): PedidoItemRetornoDto {
        return {
            id: item.id,
            produtoId: item.produto?.id,
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario,
            valorTotal: item.valorTotal
        }
    }
}
