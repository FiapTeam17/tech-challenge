import { Optional } from "typescript-optional";
import { PagamentoDto } from "@pagamento/dtos";

export const IPagamentoRepositoryGateway: unique symbol = Symbol("IPagamentoRepositoryGateway");

export interface IPagamentoRepositoryGateway {
    salvar(dto: PagamentoDto): Promise<PagamentoDto>;
    atualizarStatus(pagamento: PagamentoDto): Promise<void>;
    atualizarCodigoPagamento(pagamento: PagamentoDto): Promise<void>;
    obterPorId(pagamentoId: number): Promise<Optional<PagamentoDto>>;
    obterPorPedidoId(pedidoId: number): Promise<PagamentoDto[]>;
    obterPorPedidoIdECodigoPagamento(pedidoId: number, codigoPagamento: string): Promise<Optional<PagamentoDto>>;
    obterPorCodigoPagamento(codigoPagamento: string): Promise<Optional<PagamentoDto>>;
}