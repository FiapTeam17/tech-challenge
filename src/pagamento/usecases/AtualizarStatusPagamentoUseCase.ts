import { Optional } from "typescript-optional";
import { IAtualizarStatusPagamentoUseCase, IPagamentoRepositoryGateway } from "@pagamento/interfaces";
import { StatusPagamento } from "@pagamento/types";
import { PagamentoDto } from "@pagamento/dtos";
import { PedidoNotFoundException } from "@pagamento/usecases/exceptions";
import { Logger } from "@tsed/logger";

export class AtualizarStatusPagamentoUseCase implements IAtualizarStatusPagamentoUseCase {
    constructor(
        private pagamentoRepositoryGateway: IPagamentoRepositoryGateway,
        private logger: Logger) {
    }

    async atualizarStatus(pedidoId: number, codigoPagamento: string, status: StatusPagamento): Promise<void> {
        this.logger.trace("Start id={}", pedidoId);
        const pagamento: Optional<PagamentoDto> = await this.pagamentoRepositoryGateway.obterPorPedidoIdECodigoPagamento(pedidoId, codigoPagamento);
        if (pagamento.isEmpty()) {
            this.logger.warn("Pedido id={} não encontrado", pedidoId);
            throw new PedidoNotFoundException();
        }
        const pagamentoDto = pagamento.get();
        pagamentoDto.status = status;
        await this.pagamentoRepositoryGateway.atualizarStatus(pagamentoDto);
        this.logger.trace("End");
    }
}