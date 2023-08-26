import { CartaoCreditoDto } from "./CartaoCreditoDto";
import { PedidoDto } from "./PedidoDto";
import { PedidoEntity } from "../../../pedido";
import { StatusPagamento } from "../domain/StatusPagamento";

export class PagamentoDto {
    constructor(
        public readonly id?: number,
        private pedido?: PedidoDto,
        public readonly cartoesCredito?: CartaoCreditoDto[],
        private identificadorPagamentoExterno?: string,
        public status?: StatusPagamento
    ) {
    }

    public setIdentificadorPagamentoExterno(identificadorPagamentoExterno: string) {
        this.identificadorPagamentoExterno = identificadorPagamentoExterno;
    }

    public getIdentificadorPagamentoExterno(): string | undefined {
        return this.identificadorPagamentoExterno;
    }

    setPedido(pedido: PedidoDto) {
        this.pedido = pedido;
    }

    getPedido() {
        return this.pedido;
    }

    converterPedidoEntityParaDto(pedido: PedidoEntity): PedidoDto {
        return new PedidoDto(pedido.id!, pedido.status);
    }
}