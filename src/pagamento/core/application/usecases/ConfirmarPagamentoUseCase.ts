import { Inject, Logger } from "@tsed/common";
import { Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { IPagamentoExternoServiceGateway, IPagamentoRepositoryGateway, IPedidoServiceGateway } from "../ports";
import { PedidoNotFoundException } from "../exceptions/PedidoNotFoundException";
import { IAtualizarStatusPedidoUseCase, StatusPedido } from "../../../../pedido";
import { IConfirmarPagamentoUseCase } from "./IConfirmarPagamentoUseCase";
import { IPagamentoMpServiceHttpGateway } from "../ports/IPagamentoMpServiceHttpGateway";
import { Pagamento } from "../../domain/Pagamento";
import { StatusPagamento } from "../../domain/StatusPagamento";

@Injectable({
    type: ProviderType.SERVICE,
    scope: ProviderScope.REQUEST,
    provide: IConfirmarPagamentoUseCase
})
export class ConfirmarPagamentoUseCase implements IConfirmarPagamentoUseCase {

    constructor(
        @Inject() private logger: Logger,
        @Inject(IPagamentoExternoServiceGateway) private pagamentoMpServiceHttpGateway: IPagamentoExternoServiceGateway,
        @Inject(IAtualizarStatusPedidoUseCase) private atualizarStatusPedidoUseCase: IAtualizarStatusPedidoUseCase,
        @Inject(IPagamentoRepositoryGateway) private pagamentoRepositoryGateway: IPagamentoRepositoryGateway
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
        pagamentoDto.status = Pagamento.mapStatus(statusPagamento).get();
        await this.pagamentoRepositoryGateway.atualizarStatus(pagamentoDto);
        if (pagamentoDto.status === StatusPagamento.PAGO) {
            await this.atualizarStatusPedidoUseCase.atualizarStatus(pagamentoDto!.getPedido()!.id, StatusPedido.RECEBIDO);
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

    // private async obtemPedidoPorPagamentoId(identificadorPagamento: string) {
    //     const pedidoOp = await this.pedidoServiceGateway.obterPorIdentificadorPagamento(identificadorPagamento);
    //     if (pedidoOp.isEmpty()) {
    //         this.logger.warn("Pedido não encontrado. identificadorPagamento={}", identificadorPagamento);
    //         throw new PedidoNotFoundException();
    //     }
    //     return pedidoOp.get();
    // }
}