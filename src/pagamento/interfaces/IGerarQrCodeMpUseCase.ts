import { QrCodeResponseDto } from "..";

export const IGerarQrCodeMpUseCase: unique symbol = Symbol("IGerarQrCodeMpUseCase");

export interface IGerarQrCodeMpUseCase {
    gerarQrCode(pagamentoId: number, valor: number): Promise<QrCodeResponseDto>;
}