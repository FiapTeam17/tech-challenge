import { IObterPedidoUseCase, IPedidoRepositoryGateway } from "@pedido/interfaces";
import { Logger } from "@tsed/common";
import { PedidoRetornoDto, PedidoEmAndamentoDto, PedidoPagamentoDto } from "@pedido/dtos";
import { PedidoNotFoundException } from "./exceptions/PedidoNotFoundException";
import { PedidoEntity } from "@pedido/entities";
import { StatusPedidoEnumMapper } from "@pedido/types";
import { IObterPagamentoUseCase } from "@pagamento/interfaces";
import { StatusPagamento } from "@pagamento/types";

export class ObterPedidoUseCase implements IObterPedidoUseCase {

    constructor(
        private pedidoRepositoryGateway: IPedidoRepositoryGateway,
        private obterPagamentoUseCase: IObterPagamentoUseCase,
        private logger: Logger
    ) {
    }

    async obterPorId(id: number): Promise<PedidoRetornoDto> {
        this.logger.trace("Start id={}", id);

        const pedidoOp = await this.pedidoRepositoryGateway.obterPorId(id);
        if (pedidoOp.isEmpty()) {
            this.logger.warn("Pedido não encontrado. id={}", id);
            throw new PedidoNotFoundException();
        }

        const pedido = pedidoOp.get();
        this.logger.trace("End pedido={}", pedido);
        return PedidoRetornoDto.getInstance(pedido);
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

    async obterPorStatusAndIdentificadorPagamento(status: string, identificadorPagamento: string): Promise<PedidoRetornoDto[]> {
        this.logger.trace("Start status={}, identificadorPagamento={}", status, identificadorPagamento);
        const pedidos = await this.pedidoRepositoryGateway.obterPorStatusAndIdentificadorPagamento(StatusPedidoEnumMapper.stringParaEnum(status), identificadorPagamento);
        this.logger.trace("End pedidos={}", pedidos);
        return pedidos.map(p => PedidoRetornoDto.getInstance(p));
    }

    async obterPorIdentificadorPagamento(identificadorPagamento: string): Promise<PedidoRetornoDto> {
        this.logger.trace("Start identificadorPagamento={}", identificadorPagamento);
        const pedidoOp = await this.pedidoRepositoryGateway.obterPorIdentificadorPagamento(identificadorPagamento);

        if (pedidoOp.isEmpty()) {
            this.logger.warn("Pedido não encontrado. identificadorPagamento={}", identificadorPagamento);
            throw new PedidoNotFoundException();
        }

        const pedido = pedidoOp.get();
        this.logger.trace("End pedido={}", pedido);
        return PedidoRetornoDto.getInstance(pedido);
    }

    async consultaStatusPagamento(idPedido: number): Promise<PedidoPagamentoDto> {
        this.logger.trace("Start idPedido={}", idPedido);
        const pedidoOp = await this.pedidoRepositoryGateway.obterPorId(idPedido);
        if (pedidoOp.isEmpty()) {
            this.logger.warn("Pedido não encontrado.");
            return new PedidoPagamentoDto(idPedido, false);
        }
        const pedidoDto = pedidoOp.get();
        const pagamentosDto = await this.obterPagamentoUseCase.obtemPagamentoPorPedidoId(pedidoDto.id!);
        if (pagamentosDto == undefined || pagamentosDto.length == 0) {
            this.logger.warn("Pagamento não encontrado.");
            return new PedidoPagamentoDto(pedidoDto.id!, false);
        }
        this.logger.trace("End pedido={}", pedidoDto.id);
        const existeAlgumPagamentoPago = pagamentosDto.some(x => x.status === StatusPagamento.PAGO);
        return new PedidoPagamentoDto(pedidoDto.id!, existeAlgumPagamentoPago);
    }
}