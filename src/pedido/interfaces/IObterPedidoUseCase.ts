import { PedidoRetornoDto, PedidoEmAndamentoDto, PedidoPagamentoDto } from "@pedido/dtos";

export const IObterPedidoUseCase: unique symbol = Symbol("IObterPedidoUseCase");

export interface IObterPedidoUseCase {
    obterPorId(id: number): Promise<PedidoRetornoDto>;

    obterEmAndamento(): Promise<PedidoEmAndamentoDto[]>;

    obterPorStatusAndIdentificadorPagamento(status: string, identificadorPagamento: string): Promise<PedidoRetornoDto[]>;

    obterPorIdentificadorPagamento(identificadorPagamento: string): Promise<PedidoRetornoDto>;

    consultaStatusPagamento(idPedido: number): Promise<PedidoPagamentoDto>;
}