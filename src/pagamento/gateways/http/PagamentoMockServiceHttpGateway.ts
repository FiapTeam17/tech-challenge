import { Logger } from "@tsed/logger";
import { IPagamentoMpServiceHttpGateway } from "@pagamento/interfaces";
import { PagamentoMercadoPagoDto, QrCodeRequestDto, QrCodeResponseDto } from "@pagamento/dtos";
import { Optional } from "typescript-optional";

export class PagamentoMockExternalServiceHttpGateway implements IPagamentoMpServiceHttpGateway {

    constructor(
      private logger: Logger
    ){

    }

    criarQrCode(qrCodeDtoRequestDto: QrCodeRequestDto): Promise<Optional<QrCodeResponseDto>> {
        return Promise.resolve(Optional.empty());
    }

    obterPagamento(identificadorPagamento: string): Promise<Optional<PagamentoMercadoPagoDto>> {
        return Promise.resolve(Optional.empty());
    }
}