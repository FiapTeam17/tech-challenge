import { Optional } from "typescript-optional";
import {
    PagamentoMercadoPagoDto,
    QrCodeRequestDto,
    QrCodeResponseDto,
    RequestPagamentoDto,
    ResponsePagamentoDto
} from "@pagamento/dtos";
import { StatusPedido } from "@pedido/entities";

export const IPagamentoMpServiceHttpGateway: unique symbol = Symbol("IPagamentoMpServiceHttpGateway");

export interface IPagamentoMpServiceHttpGateway {
    criarQrCode(qrCodeDtoRequestDto: QrCodeRequestDto): Promise<Optional<QrCodeResponseDto>>
    obterPagamento(identificadorPagamento: string): Promise<Optional<PagamentoMercadoPagoDto>>;
}