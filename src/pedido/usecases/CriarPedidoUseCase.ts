import { Logger } from "@tsed/common";
import { ICriarPedidoUseCase, IPedidoRepositoryGateway } from "@pedido/interfaces";
import { ProdutoNotFoundException } from "@gerencial/usecases";
import { PedidoCadastroDto, PedidoConsultaDto } from "@pedido/dtos";
import { PedidoEntity, PedidoItemEntity, StatusPedido } from "@pedido/entities";
import { ClienteEntity, ProdutoEntity } from "@gerencial/entities";
import { IObterClienteUseCase, IObterProdutoUseCase } from "@gerencial/interfaces";
import { IGerarQrCodeMpUseCase } from "@pagamento/interfaces/IGerarQrCodeMpUseCase";
import { PagamentoDto, QrCodeRequestDto } from "@pagamento/dtos";
import { ICriarPagamentoUseCase } from "@pagamento/interfaces/ICriarPagamentoUseCase";
import { StatusPagamento } from "@pagamento/types";

export class CriarPedidoUseCase implements ICriarPedidoUseCase {

    constructor(
        private pedidoRepositoryGateway: IPedidoRepositoryGateway,
        private obterProdutoUseCase: IObterProdutoUseCase,
        private obterClienteUseCase: IObterClienteUseCase,
        private gerarQrCodeMpUseCase: IGerarQrCodeMpUseCase,
        private criarPagamentoUseCase: ICriarPagamentoUseCase,
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

        const qrCodeResponseDto = await this.gerarQrCodeMpUseCase.gerarQrCode(new QrCodeRequestDto());

        await this.criarPagamentoUseCase.criar(
            new PagamentoDto(undefined, pedido.id, undefined, StatusPagamento.PENDENTE, qrCodeResponseDto.qr_data));
        this.logger.trace("End id={}", id);
        return PedidoConsultaDto.getInstance(pedido.toPedidoQrDataDto(qrCodeResponseDto.qr_data));
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

    private dtoToDomain(pedidoDto: PedidoCadastroDto): PedidoEntity {
        let cliente = undefined;
        if (pedidoDto.clienteId) {
            cliente = new ClienteEntity(pedidoDto.clienteId);
        }

        const pedido = new PedidoEntity(undefined, cliente, pedidoDto.observacao);

        pedido.itens = pedidoDto.itens.map(i => {
            return new PedidoItemEntity(undefined, pedido,
              new ProdutoEntity(i.produtoId),
              i.quantidade);
        });

        return pedido;
    }
}