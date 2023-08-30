import { PagamentoMercadoPagoDto, RequestPagamentoDto, ResponsePagamentoDto } from "@pagamento/dtos";
import { Optional } from "typescript-optional";
import { StatusPedido } from "@pedido/entities";

export const IPagamentoExternoServiceGateway: unique symbol = Symbol("IPagamentoExternoServiceGateway");

export interface IPagamentoExternoServiceGateway {
    enviarPagamento(dto: RequestPagamentoDto): Promise<ResponsePagamentoDto>;
    obterPagamento(identificadorPagamento: string): Promise<Optional<PagamentoMercadoPagoDto>>;
    mapStatus(statusPagamento: string): StatusPedido;
}