import { Description, Enum, Example, Property } from "@tsed/schema";
import { OnSerialize } from "@tsed/json-mapper";
import { PedidoEntity, StatusPedido } from "@pedido/entities";
import { STATUS_PEDIDO, StatusPedidoEnumMapper } from "@pedido/types";

export class PedidoEmAndamentoDto {
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

    @Description("Data e hora do cadastro")
    @Example("2001-10-15 13:40:55")
    @Property()
    public readonly dataCadastro?: Date;

    @Description("Tempo de espera em minutos")
    @Example("100")
    @Property()
    public readonly tempoEspera?: number;

    constructor(pedido: PedidoEntity) {
        this.id = pedido.id;
        this.observacao = pedido.observacao;
        this.clienteId = pedido.cliente?.id;
        this.status = pedido.status;
        this.dataCadastro = pedido.dataCadastro;
        this.tempoEspera = pedido.tempoEspera();
    }
}