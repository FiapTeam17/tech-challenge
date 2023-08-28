import { Inject, Logger } from "@tsed/common";
import { IPagamentoRepositoryGateway} from "../ports";
import { Optional } from "typescript-optional";
import { PedidoNotFoundException } from "../exceptions/PedidoNotFoundException";
import { Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { IAtualizarStatusPagamentoUseCase } from "./IAtualizarStatusPagamentoUseCase";
import { PagamentoDto } from "../../dto/PagamentoDto";
import { StatusPagamento } from "../../domain/StatusPagamento";

@Injectable({
    type: ProviderType.SERVICE,
    scope: ProviderScope.REQUEST,
    provide: IAtualizarStatusPagamentoUseCase
})
export class AtualizarStatusPagamentoUseCase implements IAtualizarStatusPagamentoUseCase {
    constructor(
        @Inject(IPagamentoRepositoryGateway) private pagamentoRepositoryGateway: IPagamentoRepositoryGateway,
        @Inject() private logger: Logger) {
    }

    async atualizarStatus(pedidoId: number, identificador: string, status: StatusPagamento): Promise<void> {
        this.logger.trace("Start id={}", pedidoId);
        const pagamento: Optional<PagamentoDto> = await this.pagamentoRepositoryGateway.obterPorPedidoIdEIdentificador(pedidoId, identificador);
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