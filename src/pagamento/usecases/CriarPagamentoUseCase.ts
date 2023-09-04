import { ICriarPagamentoUseCase, IPagamentoRepositoryGateway } from "@pagamento/interfaces";
import { PagamentoDto } from "@pagamento/dtos";
import { Logger } from "@tsed/logger";
import { StatusPagamento } from "@pagamento/types";


export class CriarPagamentoUseCase implements ICriarPagamentoUseCase {
    constructor(
        private pagamentoRepositoryGateway: IPagamentoRepositoryGateway,
        private logger: Logger) {
    }

    async criar(pagamentoDto: PagamentoDto): Promise<PagamentoDto> {
        pagamentoDto.status = StatusPagamento.PENDENTE;
        return await this.pagamentoRepositoryGateway.salvar(pagamentoDto);
    }
}