import { Optional } from "typescript-optional";
import {
    PagamentoMercadoPagoDto,
    QrCodeRequestDto,
    QrCodeResponseDto,
} from "@pagamento/dtos";

export const IPagamentoMpServiceHttpGateway: unique symbol = Symbol("IPagamentoMpServiceHttpGateway");

export interface IPagamentoMpServiceHttpGateway {
    criarQrCode(qrCodeDtoRequestDto: QrCodeRequestDto): Promise<QrCodeResponseDto>
    obterPagamento(codigoPagamento: string): Promise<Optional<PagamentoMercadoPagoDto>>;
}