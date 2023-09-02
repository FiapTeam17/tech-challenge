import { Logger } from "@tsed/logger";
import { IPagamentoMpServiceHttpGateway } from "@pagamento/interfaces";
import { PagamentoMercadoPagoDto, QrCodeRequestDto, QrCodeResponseDto } from "@pagamento/dtos";
import { Optional } from "typescript-optional";

export class PagamentoMockServiceHttpGateway implements IPagamentoMpServiceHttpGateway {

    constructor(
        private logger: Logger,
    ) {

    }

    criarQrCode(qrCodeDtoRequestDto: QrCodeRequestDto): Promise<QrCodeResponseDto> {
        const crypto = require('crypto');
        qrCodeDtoRequestDto.notification_url = "";
        const qrCodeMockResponseDto = new QrCodeResponseDto();
        qrCodeMockResponseDto.qr_data = crypto.randomBytes(8).toString('hex');
        return Promise.resolve(qrCodeMockResponseDto);
    }

    obterPagamento(codigoPagamento: string): Promise<Optional<PagamentoMercadoPagoDto>> {
        const pagamentoMockMercadoPagoDto = new PagamentoMercadoPagoDto();
        pagamentoMockMercadoPagoDto.status = "approved";
        pagamentoMockMercadoPagoDto.id = codigoPagamento;
        return Promise.resolve(Optional.ofNullable(pagamentoMockMercadoPagoDto));
    }
}