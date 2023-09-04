import { IDefinirQrCodePagamentoUseCase, IPagamentoRepositoryGateway } from "@pagamento/interfaces";
import { PagamentoDto } from "@pagamento/dtos";
import { Logger } from "@tsed/logger";
import { ProdutoNotFoundException } from "@gerencial/usecases";


export class DefinirQrCodePagamentoUseCase implements IDefinirQrCodePagamentoUseCase {
    constructor(
        private pagamentoRepositoryGateway: IPagamentoRepositoryGateway,
        private logger: Logger) {
    }

    async atualizar(pagamentoId: number, qrCode: string): Promise<PagamentoDto> {
        const pagamentoOp = await this.pagamentoRepositoryGateway.obterPorId(pagamentoId);
        if (pagamentoOp.isEmpty()) {
            this.logger.warn("Pagamento informado não existe. pagamneto.id={}", pagamentoId)
            throw new ProdutoNotFoundException();
        }

        const pagamentoDto = pagamentoOp.get();
        pagamentoDto.qrCode = qrCode;

        return await this.pagamentoRepositoryGateway.salvar(pagamentoDto);
    }
}