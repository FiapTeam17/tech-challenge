import { StatusPedido } from "@pedido/entities";

export const IAtualizarStatusPedidoUseCase: unique symbol = Symbol("IAtualizarStatusPedidoUseCase");

export interface IAtualizarStatusPedidoUseCase {
    atualizarStatus(pedidoId: number, status: StatusPedido): Promise<void>;
}