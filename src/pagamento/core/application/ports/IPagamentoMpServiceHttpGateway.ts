import { Optional } from "typescript-optional";
import { PagamentoMercadoPagoDto } from "../../dto/PagamentoMercadoPagoDto";

export const IPagamentoMpServiceHttpGateway: unique symbol = Symbol("IPagamentoMpServiceHttpGateway");

export interface IPagamentoMpServiceHttpGateway {
    obterPagamento(identificadorPagamento: string): Promise<Optional<PagamentoMercadoPagoDto>>
}