import { Inject, Logger } from "@tsed/common";
import { Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { IPagamentoExternoServiceGateway, IPedidoServiceGateway } from "../ports";
import { PedidoNotFoundException } from "../exceptions/PedidoNotFoundException";
import { Pedido, StatusPedido, StatusPedidoEnumMapper } from "../../../../pedido";
import { IConfirmarPagamentoUseCase } from "./IConfirmarPagamentoUseCase";
import { PedidoDto } from "../../dto/PedidoDto";

@Injectable({
    type: ProviderType.SERVICE,
    scope: ProviderScope.REQUEST,
    provide: IConfirmarPagamentoUseCase
})
export class ConfirmarPagamentoUseCase implements IConfirmarPagamentoUseCase {

    constructor(
        @Inject() private logger: Logger,
        @Inject(IPedidoServiceGateway) private pedidoServiceGateway: IPedidoServiceGateway,
        @Inject(IPagamentoExternoServiceGateway) private pagamentoExternoServiceGateway: IPagamentoExternoServiceGateway
    ) {
    }

    async confirmar(identificadorPagamento: string, statusPagamento: string): Promise<void> {
        //obtemPedidoPorPagamentoId
        //atualizar o pagamento na tab Pagamento com status PAGO, RECUSADO etc
        //Se for PAGO atualziar para RECEBIDO
        this.logger.trace("Start identificadorPagamento={}, statusPagamento={}", identificadorPagamento, statusPagamento);

        const pedidoDto = await this.obtemPedidoPorPagamentoId(identificadorPagamento);

        const status = this.pagamentoExternoServiceGateway.mapStatus(statusPagamento);
        const pedido = Pedido.getInstancia(pedidoDto.id, StatusPedidoEnumMapper.stringParaEnum(pedidoDto.status));
        pedido.setStatus(status);

        const pedidoDtoStatusPago = new PedidoDto(pedido.id as number, pedido.getStatus());

        await this.pedidoServiceGateway.alterarStatus(pedidoDtoStatusPago);

        this.logger.trace("End");
    }

    async confirmarPagamentoMercadoPago(identificadorPagamento: string): Promise<void> {
        this.logger.trace("Start identificadorPagamento={}, statusPagamento={}", identificadorPagamento);
        //chamar a rota para verificar se o pagamento está ok(https://api.mercadopago.com/v1/payments/{id})
        //verificar o status do pagamento (converter de acordo com o nosso status)"PENDENTE", "PAGO", "RECUSADO"(chamar o usucase (confirmar)
        const pedidoDto = await this.obtemPedidoPorPagamentoId(identificadorPagamento);
        //const status = this.pagamentoExternoServiceGateway.mapStatus(statusPagamento);
        const pedido = Pedido.getInstancia(pedidoDto.id, StatusPedidoEnumMapper.stringParaEnum(pedidoDto.status));
        pedido.setStatus(StatusPedido.EM_PREPARACAO);
        const pedidoDtoStatusPago = new PedidoDto(pedido.id as number, pedido.getStatus());
        await this.pedidoServiceGateway.alterarStatus(pedidoDtoStatusPago);
        this.logger.trace("End");
    }

    private async obtemPedidoPorPagamentoId(identificadorPagamento: string) {
        const pedidoOp = await this.pedidoServiceGateway.obterPorIdentificadorPagamento(identificadorPagamento);
        if (pedidoOp.isEmpty()) {
            this.logger.warn("Pedido não encontrado. identificadorPagamento={}", identificadorPagamento);
            throw new PedidoNotFoundException();
        }

        return pedidoOp.get();
    }
}