import { Logger } from "@tsed/common";
import { IPedidoRepositoryGateway } from "@pedido/interfaces";
import { ObterClienteUseCase, ObterProdutoUseCase, ProdutoNotFoundException } from "@gerencial/usecases";
import { PedidoCadastroDto, PedidoConsultaDto } from "@pedido/dtos";
import { PedidoEntity, PedidoItemEntity, StatusPedido } from "@pedido/entities";
import { ClienteEntity, ProdutoEntity } from "@gerencial/entities";

export class CriarPedidoUseCase {

  constructor(
    private pedidoRepositoryGateway: IPedidoRepositoryGateway,
    private obterProdutoUseCase: ObterProdutoUseCase,
    private obterClienteUseCase: ObterClienteUseCase,
    private logger: Logger) { }

  async criar(pedidoDto: PedidoCadastroDto): Promise<PedidoConsultaDto> {
    this.logger.trace("Start pedido={}", pedidoDto);

    //TODO adicionar mapper
    const pedido = this.dtoToDomain(pedidoDto);

    await this.verificaRemoveClienteInexistente(pedido);
    await this.verificaExistenciaProduto(pedido);

    pedido.dataCadastro = new Date(Date.now());
    pedido.setStatus(StatusPedido.AGUARDANDO_CONFIRMACAO_PAGAMENTO);

    const id = await this.pedidoRepositoryGateway.criar(pedido.toPedidoDto());
    if (id !== undefined) {
      pedido.id = id;
    }
    this.logger.trace("End id={}", id);
    return PedidoConsultaDto.getInstance(pedido.toPedidoDto());
  }

  private async verificaRemoveClienteInexistente(pedido: PedidoEntity) {
    const clienteId = pedido.cliente?.id;
    if (clienteId !== undefined) {
      const cliOp = await this.obterClienteUseCase.obterPorId(clienteId);
      if (cliOp == undefined) {
        pedido.removerCliente();
      }
    }
  }

  private async verificaExistenciaProduto(pedido: PedidoEntity) {

    if (pedido.itens === undefined || pedido.itens.length === 0) {
      throw new ProdutoNotFoundException();
    }

    for (let i = 0; i < pedido.itens.length; ++i) {
      const item = pedido.itens[i];
      const produto = item.produto;

      if (produto === undefined) {
        throw new ProdutoNotFoundException();
      }

      const produtoOp = await this.obterProdutoUseCase.obterPorId(produto.id as never);
      if (produtoOp == undefined) {
        this.logger.warn("Produto informado não existe. produto.id={}", produto.id)
        throw new ProdutoNotFoundException();
      }

      item.valorUnitario = produtoOp.valor as never;
    }

  }

  private dtoToDomain(pedidoDto: PedidoCadastroDto): PedidoEntity{
    let cliente = undefined;
    if (pedidoDto.clienteId) {
      cliente = new ClienteEntity(pedidoDto.clienteId);
    }

    const pedido = new PedidoEntity(undefined, cliente, pedidoDto.observacao);

    pedido.itens = pedidoDto.itens.map(i => {
      return new PedidoItemEntity(undefined, pedido, new ProdutoEntity(i.produtoId), i.quantidade);
    });

    return pedido;
  }
}