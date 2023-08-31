import {
    IConfirmarPagamentoUseCase, IPagamentoMpServiceHttpGateway,
    IPagamentoRepositoryGateway
} from "@pagamento/interfaces";
import { IAtualizarStatusPedidoUseCase } from "@pedido/interfaces";
import { PedidoNotFoundException } from "@pagamento/usecases/exceptions";
import { PagamentoEntity } from "@pagamento/entities";
import { StatusPagamento } from "@pagamento/types";
import { StatusPedido } from "@pedido/entities";
import { Logger } from "@tsed/logger";


export class ConfirmarPagamentoUseCase implements IConfirmarPagamentoUseCase {

    constructor(
        private pagamentoMpServiceHttpGateway: IPagamentoMpServiceHttpGateway,
        private atualizarStatusPedidoUseCase: IAtualizarStatusPedidoUseCase,
        private pagamentoRepositoryGateway: IPagamentoRepositoryGateway,
        private logger: Logger
    ) {

    }

    async confirmar(identificadorPagamento: string, statusPagamento: string): Promise<void> {
        this.logger.trace("Start identificadorPagamento={}, statusPagamento={}", identificadorPagamento, statusPagamento);
        const pagamento = await this.pagamentoRepositoryGateway.obterPorIdentificador(identificadorPagamento);
        if (pagamento.isEmpty()) {
            this.logger.warn("Pagamento não encontrado. identificadorPagamento={}", identificadorPagamento);
            throw new PedidoNotFoundException();
        }
        const pagamentoDto = pagamento.get();
        pagamentoDto.status = PagamentoEntity.mapStatus(statusPagamento);
        await this.pagamentoRepositoryGateway.atualizarStatus(pagamentoDto);
        if (pagamentoDto.status === StatusPagamento.PAGO) {
            await this.atualizarStatusPedidoUseCase.atualizarStatus(pagamentoDto.pedidoId as number, StatusPedido.RECEBIDO);
        }
        this.logger.trace("End");
    }

    async confirmarPagamentoMercadoPago(identificadorPagamento: string): Promise<void> {
        this.logger.trace("Start identificadorPagamento={}, statusPagamento={}", identificadorPagamento);
        const pagamentoMp = await this.pagamentoMpServiceHttpGateway.obterPagamento(identificadorPagamento);
        //const pagamentoMp = await this.pagamentoMpServiceHttpGateway.obterPagamento(identificadorPagamento);
        const pagamentoMpDto = pagamentoMp.get();
        await this.confirmar(identificadorPagamento, pagamentoMpDto.status.toLowerCase());
    }

}