import { Optional } from "typescript-optional";
import { PagamentoDto } from "@pagamento/dtos";

export const IObterPagamentoUseCase: unique symbol = Symbol("IObterPagamentoUseCase");

export interface IObterPagamentoUseCase {
    obtemPagamentoPorPedidoId(pedidoId: number): Promise<Optional<PagamentoDto[]>>;
}