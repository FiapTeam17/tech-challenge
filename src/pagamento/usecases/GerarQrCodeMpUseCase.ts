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
    async gerarQrCode(pagamentoId: number, valor: number): Promise<QrCodeResponseDto> {
        const requestDto = new QrCodeRequestDto();
        requestDto.external_reference = pagamentoId;
        requestDto.total_amount = valor;
        return await this.pagamentoMpServiceHttpGateway.criarQrCode(requestDto);
    }
}