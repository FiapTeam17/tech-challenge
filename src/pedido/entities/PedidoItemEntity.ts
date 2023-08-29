import { PedidoEntity } from "./PedidoEntity";
import { PedidoItemDto } from "../dtos";
import { ProdutoEntity } from "@gerencial/entities";
import { ProdutoDto } from "@gerencial/dtos";

export class PedidoItemEntity {
    get id(): number | undefined{
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get pedido(): PedidoEntity | undefined{
        return this._pedido;
    }

    set pedido(value: PedidoEntity) {
        this._pedido = value;
    }

    get produto(): ProdutoEntity | undefined{
        return this._produto;
    }

    set produto(value: ProdutoEntity) {
        this._produto = value;
    }

    get quantidade(): number | undefined{
        return this._quantidade;
    }

    set quantidade(value: number) {
        this._quantidade = value;
    }

    get valorUnitario(): number | undefined{
        return this._valorUnitario;
    }

    set valorUnitario(value: number) {
        this._valorUnitario = value;
    }

    get valorTotal(): number {
        if(this._quantidade !== undefined && this._valorUnitario !== undefined) {
            return this._quantidade * this._valorUnitario;
        }
        return 0;
    }
    constructor(
        public _id?: number,
        public _pedido?: PedidoEntity,
        public _produto?: ProdutoEntity,
        public _quantidade?: number,
        public _valorUnitario?: number,
    ){}

    public toPeditoItemDto(): PedidoItemDto{
        return new PedidoItemDto(
          new ProdutoDto(this._produto?.id),
          this._quantidade || 0,
          this._valorUnitario || 0,
          this.valorTotal,
          this._pedido?.id,
          this._id
        );
    }

    static getInstance(itemDto: PedidoItemDto): PedidoItemEntity{
        return new PedidoItemEntity(
          itemDto.id,
          new PedidoEntity(itemDto.pedidoId),
          new ProdutoEntity(itemDto.produto.id),
          itemDto.quantidade,
          itemDto.valorUnitario
        );
    }
}