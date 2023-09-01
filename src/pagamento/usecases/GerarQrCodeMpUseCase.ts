import { IPagamentoMpServiceHttpGateway } from "@pagamento/interfaces";
import { Logger } from "@tsed/logger";
import { QrCodeRequestDto, QrCodeResponseDto } from "@pagamento/dtos";
import { IGerarQrCodeMpUseCase } from "@pagamento/interfaces/IGerarQrCodeMpUseCase";


export class GerarQrCodeMpUseCase implements IGerarQrCodeMpUseCase {

    constructor(
        private pagamentoMpServiceHttpGateway: IPagamentoMpServiceHttpGateway,
        private logger: Logger
    ) {

    }
    async gerarQrCode(qrCodeRequestDto: QrCodeRequestDto): Promise<QrCodeResponseDto> {
        this.logger.trace("Start external_reference={}, total_amount={}", qrCodeRequestDto.external_reference, qrCodeRequestDto.total_amount);
        return await this.pagamentoMpServiceHttpGateway.criarQrCode(qrCodeRequestDto);
    }
}