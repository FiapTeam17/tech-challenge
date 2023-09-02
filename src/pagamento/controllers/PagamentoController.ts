import { DataSource } from "typeorm";
import { Logger } from "@tsed/logger";
import { Optional } from "typescript-optional";
import { PagamentoDto } from "@pagamento/dtos";
import { StatusPagamento } from "@pagamento/types";
import {
    IAtualizarStatusPagamentoUseCase,
    IConfirmarPagamentoUseCase,
    IObterPagamentoUseCase, IPagamentoMpServiceHttpGateway,
    IPagamentoRepositoryGateway
} from "@pagamento/interfaces";
import { PagamentoMySqlRepositoryGateway } from "@pagamento/gateways";
import { AtualizarStatusPagamentoUseCase, ConfirmarPagamentoUseCase, ObterPagamentoUseCase } from "@pagamento/usecases";
import { IAtualizarStatusPedidoUseCase, IPedidoRepositoryGateway } from "@pedido/interfaces";
import { PedidoMySqlRepositoryGateway } from "@pedido/gateways";
import { AtualizarStatusPedidoUseCase } from "@pedido/usecases";
import { PagamentoMockServiceHttpGateway } from "@pagamento/gateways/http";

export class PagamentoController {

    private readonly pedidoRepositoryGateway: IPedidoRepositoryGateway;
    private readonly atualizarStatusPedidoUseCase: IAtualizarStatusPedidoUseCase;

    private readonly pagamentoRepositoryGateway: IPagamentoRepositoryGateway;
    private readonly pagamentoMpServiceHttpGateway: IPagamentoMpServiceHttpGateway;
    private readonly obterPagamentoUseCase: IObterPagamentoUseCase;
    private readonly atualizarStatusPagamentoUseCase: IAtualizarStatusPagamentoUseCase;
    private readonly confirmarPagamentoUseCase: IConfirmarPagamentoUseCase;
    constructor(
        private dataSource: DataSource,
        private logger: Logger
    ) {
        this.pedidoRepositoryGateway = new PedidoMySqlRepositoryGateway(this.dataSource, this.logger);
        this.atualizarStatusPedidoUseCase = new AtualizarStatusPedidoUseCase(this.pedidoRepositoryGateway, this.logger);

        this.pagamentoRepositoryGateway = new PagamentoMySqlRepositoryGateway(this.dataSource, this.logger);
        this.pagamentoMpServiceHttpGateway = new PagamentoMockServiceHttpGateway(this.logger);

        this.obterPagamentoUseCase = new ObterPagamentoUseCase(this.pagamentoRepositoryGateway, this.logger);
        this.atualizarStatusPagamentoUseCase = new AtualizarStatusPagamentoUseCase(this.pagamentoRepositoryGateway, this.logger);
        this.confirmarPagamentoUseCase = new ConfirmarPagamentoUseCase(this.pagamentoMpServiceHttpGateway,
            this.atualizarStatusPedidoUseCase, this.pagamentoRepositoryGateway, this.logger);
    }

    async obtemPagamentoPorPedidoId(pedidoId: number): Promise<Optional<PagamentoDto[]>> {
        return await this.obterPagamentoUseCase.obtemPagamentoPorPedidoId(pedidoId);
    }

    async atualizarStatus(pedidoId: number, codigoPagamento: string, status: StatusPagamento): Promise<void> {
        await this.atualizarStatusPagamentoUseCase.atualizarStatus(pedidoId, codigoPagamento, status);
    }

    async confirmar(codigoPagamento: string, statusPagamento: string): Promise<void> {
        await this.confirmarPagamentoUseCase.confirmar(codigoPagamento, statusPagamento);
    }

    async confirmarPagamentoMercadoPago(codigoPagamento: string): Promise<void> {
        await this.confirmarPagamentoUseCase.confirmarPagamentoMercadoPago(codigoPagamento);
    }

    async confirmarPagamentoMockMercadoPago(pedidoId: number): Promise<void> {
        await this.confirmarPagamentoUseCase.confirmarPagamentoMockMercadoPago(pedidoId);
    }
}