import { Optional } from "typescript-optional";
import { PagamentoMercadoPagoDto } from "@pagamento/dtos";

export const IPagamentoMpServiceHttpGateway: unique symbol = Symbol("IPagamentoMpServiceHttpGateway");

export interface IPagamentoMpServiceHttpGateway {
    obterPagamento(identificadorPagamento: string): Promise<Optional<PagamentoMercadoPagoDto>>
}