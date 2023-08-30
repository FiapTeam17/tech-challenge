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
import { PedidoCadastroDto, PedidoConsultaDto, PedidoEmAndamentoDto, PedidoPagamentoDto } from "@pedido/dtos";
import { StatusPedido } from "@pedido/entities";
import { IObterPagamentoUseCase, IPagamentoRepositoryGateway } from "@pagamento/interfaces";
import { PagamentoMySqlRepositoryGateway } from "@pagamento/gateways";
import { ObterPagamentoUseCase } from "@pagamento/usecases";


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

    this.pedidoRepositoryGateway = new PedidoMySqlRepositoryGateway(dataSource, logger);
    this.obterPedidoUseCase = new ObterPedidoUseCase(this.pedidoRepositoryGateway, this.obterPagamentoUseCase, logger);
    this.criarPedidoUseCase = new CriarPedidoUseCase(this.pedidoRepositoryGateway,
      this.obterProdutoUseCase, this.obterClienteUseCase, logger);
    this.atualizarStatusPedidoUseCase = new AtualizarStatusPedidoUseCase(this.pedidoRepositoryGateway, logger);
  }

  async obterPorId(id: number): Promise<PedidoConsultaDto>{
    return await this.obterPedidoUseCase.obterPorId(id);
  }

  async obterEmAndamento(): Promise<PedidoEmAndamentoDto[]>{
    return await this.obterPedidoUseCase.obterEmAndamento();
  }

  async obterPorStatusAndIdentificadorPagamento(status: string, identificadorPagamento: string): Promise<PedidoConsultaDto[]>{
    return await this.obterPedidoUseCase.obterPorStatusAndIdentificadorPagamento(status, identificadorPagamento);
  }

  async obterPorIdentificadorPagamento(identificadorPagamento: string): Promise<PedidoConsultaDto>{
    return await this.obterPedidoUseCase.obterPorIdentificadorPagamento(identificadorPagamento);
  }

  async consultaStatusPagamento(idPedido: number): Promise<PedidoPagamentoDto>{
    return await this.obterPedidoUseCase.consultaStatusPagamento(idPedido);
  }

  async criar(pedido: PedidoCadastroDto): Promise<PedidoConsultaDto>{
    return await this.criarPedidoUseCase.criar(pedido);
  }

  async atualizarStatus(pedidoId: number, status: StatusPedido): Promise<void>{
    return await this.atualizarStatusPedidoUseCase.atualizarStatus(pedidoId, status);
  }
}