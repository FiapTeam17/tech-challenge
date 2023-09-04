export const IConfirmarPagamentoUseCase: unique symbol = Symbol("IConfirmarPagamentoUseCase");

export interface IConfirmarPagamentoUseCase {
    confirmar(codigoPagamento: string, statusPagamento: string): Promise<void>;

    confirmarPagamentoMercadoPago(codigoPagamento: string): Promise<void>;
    confirmarPagamentoMockMercadoPago(pedidoId: number): Promise<void>
}