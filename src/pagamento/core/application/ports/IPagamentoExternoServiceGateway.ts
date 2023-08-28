import { StatusPedido } from "../../../../pedido";
import { RequestPagamentoDto } from "../../../../pedido/core/dtos/RequestPagamentoDto";
import { ResponsePagamentoDto } from "../../../../pedido/core/dtos/ResponsePagamentoDto";
import { Optional } from "typescript-optional";
import { PagamentoMercadoPagoDto } from "../../dto/PagamentoMercadoPagoDto";

export const IPagamentoExternoServiceGateway: unique symbol = Symbol("IPagamentoExternoServiceGateway");

export interface IPagamentoExternoServiceGateway {
    enviarPagamento(dto: RequestPagamentoDto): Promise<ResponsePagamentoDto>;
    obterPagamento(identificadorPagamento: string): Promise<Optional<PagamentoMercadoPagoDto>>;
    mapStatus(statusPagamento: string): StatusPedido;
}