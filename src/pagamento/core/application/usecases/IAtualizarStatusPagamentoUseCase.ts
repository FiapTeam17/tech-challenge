import { StatusPagamento } from "../../domain/StatusPagamento";

export const IAtualizarStatusPagamentoUseCase: unique symbol = Symbol("IAtualizarStatusPagamentoUseCase");

export interface IAtualizarStatusPagamentoUseCase {
    atualizarStatus(pedidoId: number, identificadorPagamento: string, status: StatusPagamento): Promise<void>;
}