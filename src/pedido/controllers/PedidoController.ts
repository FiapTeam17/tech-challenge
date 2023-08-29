import { DataSource } from "typeorm";
import { Logger } from "@tsed/common";
import { IPedidoRepositoryGateway } from "@pedido/interfaces";
import { AtualizarStatusPedidoUseCase, CriarPedidoUseCase, ObterPedidoUseCase } from "@pedido/usecases";
import { PedidoMySqlRepositoryGateway } from "@pedido/gateways";
import { IClienteRepositoryGateway, IProdutoRepositoryGateway } from "@gerencial/interfaces";
import { ObterClienteUseCase, ObterProdutoUseCase } from "@gerencial/usecases";
import { ClienteMySqlRepositoryGateway, ProdutoMySqlRepositoryGateway } from "@gerencial/gateways";
import { PedidoCadastroDto, PedidoConsultaDto, PedidoEmAndamentoDto, PedidoPagamentoDto } from "@pedido/dtos";
import { StatusPedido } from "@pedido/entities";


export class PedidoController {

  private readonly pedidoRepositoryGateway: IPedidoRepositoryGateway;
  private readonly obterPedidoUseCase: ObterPedidoUseCase;
  private readonly criarPedidoUseCase: CriarPedidoUseCase;
  private readonly atualizarStatusPedidoUseCase: AtualizarStatusPedidoUseCase;

  private readonly clienteRepositoryGateway: IClienteRepositoryGateway;
  private readonly obterClienteUseCase: ObterClienteUseCase;

  private readonly produtoRepositoryGateway: IProdutoRepositoryGateway;
  private readonly obterProdutoUseCase: ObterProdutoUseCase;

  constructor(
    private dataSource: DataSource,
    private logger: Logger
  ) {
    this.clienteRepositoryGateway = new ClienteMySqlRepositoryGateway(dataSource, logger);
    this.obterClienteUseCase = new ObterClienteUseCase(this.clienteRepositoryGateway, logger);

    this.produtoRepositoryGateway = new ProdutoMySqlRepositoryGateway(dataSource, logger);
    this.obterProdutoUseCase = new ObterProdutoUseCase(this.produtoRepositoryGateway, logger);

    this.pedidoRepositoryGateway = new PedidoMySqlRepositoryGateway(dataSource, logger);
    this.obterPedidoUseCase = new ObterPedidoUseCase(this.pedidoRepositoryGateway, logger);
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