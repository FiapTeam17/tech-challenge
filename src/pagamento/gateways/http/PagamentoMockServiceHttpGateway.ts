import { Logger } from "@tsed/logger";
import { IPagamentoMpServiceHttpGateway } from "@pagamento/interfaces";
import { PagamentoMercadoPagoDto, QrCodeRequestDto, QrCodeResponseDto } from "@pagamento/dtos";
import { Optional } from "typescript-optional";

export class PagamentoMockServiceHttpGateway implements IPagamentoMpServiceHttpGateway {

    constructor(
        private logger: Logger
    ) {

    }

    criarQrCode(qrCodeDtoRequestDto: QrCodeRequestDto): Promise<Optional<QrCodeResponseDto>> {
        const qrCodeMockResponseDto = new QrCodeResponseDto();
        qrCodeMockResponseDto.qr_data = "00020101021243650016COM.MERCADOLIBRE02013063638f1192a-5fd1-4180-a180-8bcae3556bc35204000053039865802BR5925IZABEL AAAA DE MELO6007BARUERI62070503***63040B6D";
        return Promise.resolve(Optional.ofNullable(qrCodeMockResponseDto));
    }

    obterPagamento(codigoPagamento: string): Promise<Optional<PagamentoMercadoPagoDto>> {
        const pagamentoMockMercadoPagoDto = new PagamentoMercadoPagoDto();
        pagamentoMockMercadoPagoDto.status = "approved";
        pagamentoMockMercadoPagoDto.id = parseInt(codigoPagamento);
        return Promise.resolve(Optional.ofNullable(pagamentoMockMercadoPagoDto));
    }
}