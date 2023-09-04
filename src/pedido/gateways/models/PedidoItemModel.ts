import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PedidoItemDto } from "@pedido/dtos";
import { PedidoModel } from "@pedido/gateways";
import { ProdutoModel } from "@gerencial/gateways";

@Entity("PedidoItem")
export class PedidoItemModel {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    nullable: false
  })
  quantidade: number;

  @Column({
    type: "float",
    nullable: false
  })
  valorUnitario: number;

  @Column({
    type: "float",
    nullable: false
  })
  valorTotal: number;

  produtoId: number;

  @ManyToOne(() => ProdutoModel, { nullable: false })
  produto: ProdutoModel;

  @ManyToOne(() => PedidoModel, (pedido) => pedido.itens, { nullable: false })
  pedido: PedidoModel;

  constructor(item?: PedidoItemDto, pedidoEntity?: PedidoModel) {
   if(item){
     if (item.produto) {
       this.produto = new ProdutoModel(item.produto);
     }
     this.id = item.id;
     this.quantidade = item.quantidade;
     this.valorUnitario = item.valorUnitario;
     this.valorTotal = item.valorTotal;
   }

    if(pedidoEntity) {
      this.pedido = pedidoEntity;
    }
  }

  public getDto(): PedidoItemDto {

    return new PedidoItemDto(
      this.produto.getProdutoDto(),
      this.quantidade,
      this.valorUnitario,
      this.valorTotal,
      this.pedido?.id,
      this.id
    );
  }
}