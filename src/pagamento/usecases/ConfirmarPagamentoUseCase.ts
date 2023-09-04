import { PagamentoMercadoPagoDto } from './../dtos/PagamentoMercadoPagoDto';
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

    async confirmar(codigoPagamento: string, statusPagamento: string): Promise<void> {
        this.logger.trace("Start identificadorPagamento={}, statusPagamento={}", codigoPagamento, statusPagamento);
        const pagamento = await this.pagamentoRepositoryGateway.obterPorCodigoPagamento(codigoPagamento);
        if (pagamento.isEmpty()) {
            this.logger.warn("Pagamento não encontrado. identificadorPagamento={}", codigoPagamento);
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

    async confirmarPagamentoMercadoPago(codigoPagamento: string): Promise<void> {
        this.logger.trace("Start identificadorPagamento={}", codigoPagamento);
        const pagamentoMp = await this.pagamentoMpServiceHttpGateway.obterPagamento(codigoPagamento);
        const pagamentoMpDto = pagamentoMp.get();
        await this.confirmar(codigoPagamento, pagamentoMpDto.status.toLowerCase());
    }

    async confirmarPagamentoMockMercadoPago(pedidoId: number): Promise<void> {
        this.logger.trace("Start pedidoId={}", pedidoId);
        const crypto = require('crypto');
        const pagamentoDtoOp = await this.pagamentoRepositoryGateway.obterPorPedidoId(pedidoId);
        if (pagamentoDtoOp.isEmpty()) {
            this.logger.warn("Pagamento não encontrado. pedidoId={}", pedidoId);
            throw new PedidoNotFoundException();
        }
        const pagamentoDto = pagamentoDtoOp.get();
        const pagamentoDtoUltimoRegistro = pagamentoDto[pagamentoDto.length - 1];
        pagamentoDtoUltimoRegistro.codigoPagamento = crypto.randomBytes(8).join('');

        await this.pagamentoRepositoryGateway.atualizarCodigoPagamento(pagamentoDtoUltimoRegistro);
        const pagamentoMercadoPagoDto = new PagamentoMercadoPagoDto();
        pagamentoMercadoPagoDto.id = pagamentoDtoUltimoRegistro.codigoPagamento as string;

        const pagamentoMp = await this.pagamentoMpServiceHttpGateway.obterPagamento(pagamentoMercadoPagoDto.id.toString());
        const pagamentoMpDto = pagamentoMp.get();
        await this.confirmar(pagamentoMpDto.id, pagamentoMpDto.status);
    }
}