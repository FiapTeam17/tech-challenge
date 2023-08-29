import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PedidoItemModel } from "@pedido/gateways";
import { PedidoDto } from "@pedido/dtos";
import { StatusPedidoEnumMapper } from "@pedido/types";
import { ClienteModel } from "@gerencial/gateways";


@Entity("Pedido")
export class PedidoModel {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        nullable: false
    })
    status: string;

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

    // @OneToMany(() => PagamentoEntity, (pagamento) => pagamento.pedido)
    // pagamentos?: PagamentoEntity[];

    constructor(pedidoDto?: PedidoDto) {
        if (pedidoDto) {
            this.id = pedidoDto.id;
            this.observaco = pedidoDto.observacao;
            this.dataCadastro = pedidoDto.dataCadastro as never;
            this.dataConclusao = pedidoDto.dataConclusao;
            this.itens = pedidoDto.itens?.map(i => new PedidoItemModel(i, this));
            const status = pedidoDto.status;
            if (status !== undefined) {
                this.status = StatusPedidoEnumMapper.enumParaString(status);
            }

            if (pedidoDto?.cliente) {
                this.cliente = new ClienteModel(pedidoDto?.cliente);
            }
        }
    }

    public getDto(): PedidoDto {

        const itens = this.itens?.map(i => i.getDto());

        return new PedidoDto(
            StatusPedidoEnumMapper.stringParaEnum(this.status),
            this.dataCadastro,
            itens,
            this.observaco,
            this.cliente?.getClientDto(),
            this.dataConclusao,
            this.id
        );
    }
}