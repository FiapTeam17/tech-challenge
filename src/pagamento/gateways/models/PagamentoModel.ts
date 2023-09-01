import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PedidoModel } from "@pedido/gateways";
import { PagamentoDto } from "@pagamento/dtos";
import { StatusPagamento } from "@pagamento/types";
import { StatusPagamentoEnumMapper } from "@pagamento/types/StatusPagamentoEnumMapper";

@Entity("Pagamento")
export class PagamentoModel {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        nullable: false
    })
    public codigoPagamento?: string;

    @ManyToOne(() => PedidoModel, (pedido) => pedido.pagamentos, { eager: true })
    pedido?: PedidoModel;

    @Column({
        nullable: true
    })
    public status: string;

    static getInstancia(pagamento: PagamentoDto): PagamentoModel {
        const pagamentoEntity = new PagamentoModel();
        pagamentoEntity.id = pagamento.id;
        pagamentoEntity.codigoPagamento = pagamento.getIdentificadorPagamentoExterno();
        pagamentoEntity.pedido = { id: pagamento.pedidoId } as PedidoModel;
        pagamentoEntity.status = StatusPagamentoEnumMapper.enumParaString(pagamento.status);

        return pagamentoEntity;
    }

    public getDto(): PagamentoDto {
        return new PagamentoDto(this.id, this.pedido?.id, this.codigoPagamento, StatusPagamentoEnumMapper.stringParaEnum(this.status));
    }
}
