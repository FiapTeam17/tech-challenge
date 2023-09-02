import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PedidoModel } from "@pedido/gateways";
import { PagamentoDto } from "@pagamento/dtos";
import { StatusPagamentoEnumMapper } from "@pagamento/types/StatusPagamentoEnumMapper";

@Entity("Pagamento")
export class PagamentoModel {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        nullable: true
    })
    public codigoPagamento?: string;

    @ManyToOne(() => PedidoModel, (pedido) => pedido.pagamentos, { eager: true })
    pedido?: PedidoModel;

    @Column({
        nullable: true,
        length: 10
    })
    public status?: string;

    @Column({
        nullable: true,
        length: 300
    })
    public qrcode?: string;

    static getInstancia(pagamento: PagamentoDto): PagamentoModel {
        const pagamentoEntity = new PagamentoModel();
        pagamentoEntity.id = pagamento.id;
        pagamentoEntity.codigoPagamento = pagamento.codigoPagamento;
        pagamentoEntity.pedido = { id: pagamento.pedidoId } as PedidoModel;
        pagamentoEntity.status = StatusPagamentoEnumMapper.enumParaString(pagamento.status);
        pagamentoEntity.qrcode = pagamento.qrCode;

        return pagamentoEntity;
    }

    public getDto(): PagamentoDto {
        return new PagamentoDto(this.id, this.pedido?.id, this.codigoPagamento, StatusPagamentoEnumMapper.stringParaEnum(this.status), this.qrcode);
    }
}
