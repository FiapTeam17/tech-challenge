import { IObterPedidoUseCase, IPedidoRepositoryGateway } from "@pedido/interfaces";
import { Logger } from "@tsed/common";
import { PedidoConsultaDto, PedidoEmAndamentoDto, PedidoPagamentoDto } from "@pedido/dtos";
import { PedidoNotFoundException } from "./exceptions/PedidoNotFoundException";
import { PedidoEntity } from "@pedido/entities";
import { StatusPedidoEnumMapper } from "@pedido/types";
import { IObterPagamentoUseCase } from "@pagamento/interfaces";

export class ObterPedidoUseCase implements IObterPedidoUseCase {

    constructor(
        private pedidoRepositoryGateway: IPedidoRepositoryGateway,
        private obterPagamentoUseCase: IObterPagamentoUseCase,
        private logger: Logger
    ) {
    }

    async obterPorId(id: number): Promise<PedidoConsultaDto> {
        this.logger.trace("Start id={}", id);

        const pedidoOp = await this.pedidoRepositoryGateway.obterPorId(id);
        if (pedidoOp.isEmpty()) {
            this.logger.warn("Pedido não encontrado. id={}", id);
            throw new PedidoNotFoundException();
        }

        const pedido = pedidoOp.get();
        this.logger.trace("End pedido={}", pedido);
        return PedidoConsultaDto.getInstance(pedido);
    }

    async obterEmAndamento(): Promise<PedidoEmAndamentoDto[]> {
        this.logger.trace("Start em andamento");

        const pedidoOp = await this.pedidoRepositoryGateway.obterEmAndamento();
        if (pedidoOp.isEmpty()) {
            this.logger.warn("Pedidos não retornados");
            throw new PedidoNotFoundException();
        }

        const pedidos = pedidoOp.get();

        this.logger.trace("End em andamento");
        return pedidos.map(pe => new PedidoEmAndamentoDto(PedidoEntity.getInstance(pe)));
    }

    async obterPorStatusAndIdentificadorPagamento(status: string, identificadorPagamento: string): Promise<PedidoConsultaDto[]> {
        this.logger.trace("Start status={}, identificadorPagamento={}", status, identificadorPagamento);
        const pedidos = await this.pedidoRepositoryGateway.obterPorStatusAndIdentificadorPagamento(StatusPedidoEnumMapper.stringParaEnum(status), identificadorPagamento);
        this.logger.trace("End pedidos={}", pedidos);
        return pedidos.map(p => PedidoConsultaDto.getInstance(p));
    }

    async obterPorIdentificadorPagamento(identificadorPagamento: string): Promise<PedidoConsultaDto> {
        this.logger.trace("Start identificadorPagamento={}", identificadorPagamento);
        const pedidoOp = await this.pedidoRepositoryGateway.obterPorIdentificadorPagamento(identificadorPagamento);

        if (pedidoOp.isEmpty()) {
            this.logger.warn("Pedido não encontrado. identificadorPagamento={}", identificadorPagamento);
            throw new PedidoNotFoundException();
        }

        const pedido = pedidoOp.get();
        this.logger.trace("End pedido={}", pedido);
        return PedidoConsultaDto.getInstance(pedido);
    }

    async consultaStatusPagamento(idPedido: number): Promise<PedidoPagamentoDto> {
        this.logger.trace("Start idPedido={}", idPedido);
        const pedidoDto = await this.pedidoRepositoryGateway.obterPorId(idPedido);
        if (pedidoDto.isEmpty()) {
            this.logger.warn("Pedido não encontrado.");
            return new PedidoPagamentoDto(idPedido, false);
        }
        const pedido = pedidoDto.get();
        const pagamentos = await this.obterPagamentoUseCase.obtemPagamentoPorPedidoId(pedido.id!);
        if (pagamentos.isEmpty() || pagamentos.get().length == 0) {
            this.logger.warn("Pagamento não encontrado.");
            return new PedidoPagamentoDto(pedido.id!, false);
        }
        this.logger.trace("End pedido={}", pedido.id);
        const existeAlgumPagamentoPago = pagamentos.get().some(x => x.status === "PAGO");
        return new PedidoPagamentoDto(pedido.id!, existeAlgumPagamentoPago);
    }
}