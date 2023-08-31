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
import { PagamentoMockExternalServiceHttpGateway } from "@pagamento/gateways/http";
import { PedidoMySqlRepositoryGateway } from "@pedido/gateways";
import { AtualizarStatusPedidoUseCase } from "@pedido/usecases";

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
  ){
    this.pedidoRepositoryGateway = new PedidoMySqlRepositoryGateway(this.dataSource, this.logger);
    this.atualizarStatusPedidoUseCase = new AtualizarStatusPedidoUseCase(this.pedidoRepositoryGateway, this.logger);

    this.pagamentoRepositoryGateway = new PagamentoMySqlRepositoryGateway(this.dataSource, this.logger);
    this.pagamentoMpServiceHttpGateway = new PagamentoMockExternalServiceHttpGateway(this.logger);

    this.obterPagamentoUseCase = new ObterPagamentoUseCase(this.pagamentoRepositoryGateway, this.logger);
    this.atualizarStatusPagamentoUseCase = new AtualizarStatusPagamentoUseCase(this.pagamentoRepositoryGateway, this.logger);
    this.confirmarPagamentoUseCase = new ConfirmarPagamentoUseCase(this.pagamentoMpServiceHttpGateway,
      this.atualizarStatusPedidoUseCase, this.pagamentoRepositoryGateway, this.logger);
  }

  async obtemPagamentoPorPedidoId(pedidoId: number): Promise<Optional<PagamentoDto[]>>{
    return await this.obterPagamentoUseCase.obtemPagamentoPorPedidoId(pedidoId);
  }

  async atualizarStatus(pedidoId: number, identificadorPagamento: string, status: StatusPagamento): Promise<void>{
    return this.atualizarStatusPagamentoUseCase.atualizarStatus(pedidoId, identificadorPagamento, status);
  }

  async confirmar(identificadorPagamento: string, statusPagamento: string): Promise<void>{
    return await this.confirmarPagamentoUseCase.confirmar(identificadorPagamento, statusPagamento);
  }

  async confirmarPagamentoMercadoPago(identificadorPagamento: string): Promise<void>{
    return await this.confirmarPagamentoUseCase.confirmarPagamentoMercadoPago(identificadorPagamento);
  }

}