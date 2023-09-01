import { QrCodeRequestDto } from '@pagamento/dtos';
import { QrCodeResponseDto } from "..";

export const IGerarQrCodeMpUseCase: unique symbol = Symbol("IGerarQrCodeMpUseCase");

export interface IGerarQrCodeMpUseCase {
    gerarQrCode(qrCodeRequestDto: QrCodeRequestDto): Promise<QrCodeResponseDto>;
}