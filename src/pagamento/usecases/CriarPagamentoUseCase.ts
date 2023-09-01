import { IPagamentoRepositoryGateway } from "@pagamento/interfaces";
import { PagamentoDto } from "@pagamento/dtos";
import { Logger } from "@tsed/logger";
import { ICriarPagamentoUseCase } from "@pagamento/interfaces/ICriarPagamentoUseCase";

export class CriarPagamentoUseCase implements ICriarPagamentoUseCase {
    constructor(
        private pagamentoRepositoryGateway: IPagamentoRepositoryGateway,
        private logger: Logger) {
    }

    async criar(pagamentoDto: PagamentoDto): Promise<number | undefined> {
        this.logger.trace("Start id={}", pagamentoDto.pedidoId);
        return await this.pagamentoRepositoryGateway.criar(pagamentoDto);
    }
}