import { StatusPagamento } from "@pagamento/types";

export const IAtualizarStatusPagamentoUseCase: unique symbol = Symbol("IAtualizarStatusPagamentoUseCase");

export interface IAtualizarStatusPagamentoUseCase {
    atualizarStatus(pedidoId: number, codigoPagamento: string, status: StatusPagamento): Promise<void>;
}