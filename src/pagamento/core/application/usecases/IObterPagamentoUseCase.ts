import { PagamentoDto } from "../../dto/PagamentoDto";
import { Optional } from "typescript-optional";

export const IObterPagamentoUseCase: unique symbol = Symbol("IObterPagamentoUseCase");

export interface IObterPagamentoUseCase {
    obtemPagamentoPorPedidoId(pedidoId: number): Promise<Optional<PagamentoDto[]>>;
}