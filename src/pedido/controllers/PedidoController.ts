import { DataSource } from "typeorm";
import { Logger } from "@tsed/common";
import {
  IAtualizarStatusPedidoUseCase,
  ICriarPedidoUseCase,
  IObterPedidoUseCase,
  IPedidoRepositoryGateway
} from "@pedido/interfaces";
import { AtualizarStatusPedidoUseCase, CriarPedidoUseCase, ObterPedidoUseCase } from "@pedido/usecases";
import { PedidoMySqlRepositoryGateway } from "@pedido/gateways";
import {
  IClienteRepositoryGateway,
  IObterClienteUseCase,
  IObterProdutoUseCase,
  IProdutoRepositoryGateway
} from "@gerencial/interfaces";
import { ObterClienteUseCase, ObterProdutoUseCase } from "@gerencial/usecases";
import { ClienteMySqlRepositoryGateway, ProdutoMySqlRepositoryGateway } from "@gerencial/gateways";
import { PedidoCriarDto, PedidoRetornoDto, PedidoEmAndamentoDto, PedidoPagamentoDto } from "@pedido/dtos";
import { StatusPedido } from "@pedido/entities";
import {
  IDefinirQrCodePagamentoUseCase,
  IObterPagamentoUseCase,
  IPagamentoMpServiceHttpGateway,
  IPagamentoRepositoryGateway
} from "@pagamento/interfaces";
import { PagamentoMySqlRepositoryGateway } from "@pagamento/gateways";
import { ObterPagamentoUseCase } from "@pagamento/usecases";
import { IGerarQrCodeMpUseCase } from "@pagamento/interfaces/IGerarQrCodeMpUseCase";
import { GerarQrCodeMpUseCase } from "@pagamento/usecases/GerarQrCodeMpUseCase";
import { PagamentoMockServiceHttpGateway } from "@pagamento/gateways/http";
import { ICriarPagamentoUseCase } from "@pagamento/interfaces/ICriarPagamentoUseCase";
import { CriarPagamentoUseCase } from "@pagamento/usecases/CriarPagamentoUseCase";
import { DefinirQrCodePagamentoUseCase } from "@pagamento/usecases/DefinirQrCodePagamentoUseCase";
import { PedidoCriarRetornoDto } from "@pedido/dtos/PedidoCriarRetornoDto";


export class PedidoController {

  private readonly pedidoRepositoryGateway: IPedidoRepositoryGateway;
  private readonly obterPedidoUseCase: IObterPedidoUseCase;
  private readonly criarPedidoUseCase: ICriarPedidoUseCase;
  private readonly atualizarStatusPedidoUseCase: IAtualizarStatusPedidoUseCase;

  private readonly clienteRepositoryGateway: IClienteRepositoryGateway;
  private readonly obterClienteUseCase: IObterClienteUseCase;

  private readonly produtoRepositoryGateway: IProdutoRepositoryGateway;
  private readonly obterProdutoUseCase: IObterProdutoUseCase;

  private readonly pagamentoRepositoryGateway: IPagamentoRepositoryGateway;
  private readonly obterPagamentoUseCase: IObterPagamentoUseCase;
  private readonly gerarQrCodeMpUseCase: IGerarQrCodeMpUseCase;
  private readonly criarPagamentoUseCase: ICriarPagamentoUseCase;
  private readonly definirQrCodePagamentoUseCase: IDefinirQrCodePagamentoUseCase;

  private readonly pagamentoMpServiceHttpGateway: IPagamentoMpServiceHttpGateway;

  constructor(
    private dataSource: DataSource,
    private logger: Logger
  ) {
    this.clienteRepositoryGateway = new ClienteMySqlRepositoryGateway(dataSource, logger);
    this.obterClienteUseCase = new ObterClienteUseCase(this.clienteRepositoryGateway, logger);

    this.produtoRepositoryGateway = new ProdutoMySqlRepositoryGateway(dataSource, logger);
    this.obterProdutoUseCase = new ObterProdutoUseCase(this.produtoRepositoryGateway, logger);

    this.pagamentoRepositoryGateway = new PagamentoMySqlRepositoryGateway(this.dataSource, this.logger);
    this.obterPagamentoUseCase = new ObterPagamentoUseCase(this.pagamentoRepositoryGateway, this.logger);
    this.pagamentoMpServiceHttpGateway = new PagamentoMockServiceHttpGateway(this.logger);
    this.gerarQrCodeMpUseCase = new GerarQrCodeMpUseCase(this.pagamentoMpServiceHttpGateway, this.logger);
    this.criarPagamentoUseCase = new CriarPagamentoUseCase(this.pagamentoRepositoryGateway, this.logger);
    this.definirQrCodePagamentoUseCase = new DefinirQrCodePagamentoUseCase(this.pagamentoRepositoryGateway, this.logger);

    this.pedidoRepositoryGateway = new PedidoMySqlRepositoryGateway(dataSource, logger);
    this.obterPedidoUseCase = new ObterPedidoUseCase(this.pedidoRepositoryGateway, this.obterPagamentoUseCase, logger);
    this.criarPedidoUseCase = new CriarPedidoUseCase(this.pedidoRepositoryGateway,
      this.obterProdutoUseCase, this.obterClienteUseCase, this.gerarQrCodeMpUseCase,
      this.criarPagamentoUseCase, this.definirQrCodePagamentoUseCase, logger);
    this.atualizarStatusPedidoUseCase = new AtualizarStatusPedidoUseCase(this.pedidoRepositoryGateway, logger);
  }

  async obterPorId(id: number): Promise<PedidoRetornoDto> {
    return await this.obterPedidoUseCase.obterPorId(id);
  }

  async obterEmAndamento(): Promise<PedidoEmAndamentoDto[]> {
    return await this.obterPedidoUseCase.obterEmAndamento();
  }

  async obterPorStatusAndIdentificadorPagamento(status: string, identificadorPagamento: string): Promise<PedidoRetornoDto[]> {
    return await this.obterPedidoUseCase.obterPorStatusAndIdentificadorPagamento(status, identificadorPagamento);
  }

  async obterPorIdentificadorPagamento(identificadorPagamento: string): Promise<PedidoRetornoDto> {
    return await this.obterPedidoUseCase.obterPorIdentificadorPagamento(identificadorPagamento);
  }

  async consultaStatusPagamento(idPedido: number): Promise<PedidoPagamentoDto> {
    return await this.obterPedidoUseCase.consultaStatusPagamento(idPedido);
  }

  async criar(pedido: PedidoCriarDto): Promise<PedidoCriarRetornoDto> {
    return await this.criarPedidoUseCase.criar(pedido);
  }

  async atualizarStatus(pedidoId: number, status: StatusPedido): Promise<void> {
    return await this.atualizarStatusPedidoUseCase.atualizarStatus(pedidoId, status);
  }
}