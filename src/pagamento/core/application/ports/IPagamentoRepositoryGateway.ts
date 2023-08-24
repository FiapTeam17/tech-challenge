import { PagamentoDto } from "../../dto/PagamentoDto";
import { Optional } from "typescript-optional";

export const IPagamentoRepositoryGateway: unique symbol = Symbol("IPagamentoRepositoryGateway");

export interface IPagamentoRepositoryGateway {
    criar(dto: PagamentoDto): Promise<number | undefined>;
    obterPorPedidoId(pedidoId: number): Promise<Optional<PagamentoDto[]>>;
}