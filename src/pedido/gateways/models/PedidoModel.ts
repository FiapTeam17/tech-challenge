import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PedidoItemModel } from "@pedido/gateways";
import { PedidoDto } from "@pedido/dtos";
import { StatusPedidoEnumMapper } from "@pedido/types";
import { ClienteModel } from "@gerencial/gateways";
import { PagamentoModel } from "@pagamento/gateways/models";

@Entity("Pedido")
export class PedidoModel {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        nullable: false
    })
    status: number;

    @Column({
        nullable: false
    })
    dataCadastro: Date;

    @Column({
        nullable: true
    })
    dataConclusao?: Date;

    @Column({
        nullable: true
    })
    observaco?: string;

    @ManyToOne(() => ClienteModel, (cliente) => cliente.pedidos, { nullable: true })
        //@JoinColumn()
    cliente?: ClienteModel;

    @OneToMany(() => PedidoItemModel, (item) => item.pedido)
        //@JoinTable()
    itens?: PedidoItemModel[];

    @OneToMany(() => PagamentoModel, (pagamento) => pagamento.pedido)
    pagamentos?: PagamentoModel[];

    constructor(pedidoDto?: PedidoDto) {
        if (pedidoDto) {
            this.id = pedidoDto.id;
            this.observaco = pedidoDto.observacao;
            this.dataCadastro = pedidoDto.dataCadastro as never;
            this.dataConclusao = pedidoDto.dataConclusao;
            this.itens = pedidoDto.itens?.map(i => new PedidoItemModel(i, this));
            const status = pedidoDto.status;
            if (status !== undefined) {
                this.status = StatusPedidoEnumMapper.enumParaNumber(status);
            }

            if (pedidoDto?.cliente) {
                this.cliente = new ClienteModel(pedidoDto?.cliente);
            }
        }
    }

    public getDto(): PedidoDto {

        const itens = this.itens?.map(i => i.getDto());

        return new PedidoDto(
            StatusPedidoEnumMapper.numberParaEnum(this.status),
            this.dataCadastro,
            itens,
            this.observaco,
            this.cliente,
            this.dataConclusao,
            this.id
        );
    }
}