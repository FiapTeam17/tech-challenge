import { BodyParams, Inject, Logger, PathParams, QueryParams } from "@tsed/common";
import { Get, Patch, Post, Returns } from "@tsed/schema";
import { Controller } from "@tsed/di";
import { MysqlDataSource } from "@database";
import { PedidoController } from "@pedido/controllers";
import {
    PedidoCriarDto,
    PedidoRetornoDto,
    PedidoEmAndamentoDto,
    PedidoPagamentoDto,
    PedidoStatusDto
} from "@pedido/dtos";
import { CamposObrigatoriosNaoPreechidoException } from "@pedido/usecases";
import { StatusPedidoEnumMapper } from "@pedido/types";
import { PedidoCriarRetornoDto } from "@pedido/dtos/PedidoCriarRetornoDto";

@Controller("/pedidos")
export class PedidoApi {

    private pedidoController: PedidoController;
    constructor(
        @Inject() private logger: Logger
    ) {
        this.pedidoController = new PedidoController(MysqlDataSource, logger);
    }

    @Get("/andamento")
    @Returns(200, Array).Of(PedidoEmAndamentoDto).Description("Pedidos em andamento")
    async obterEmAndamento(): Promise<PedidoEmAndamentoDto[]> {
        this.logger.info("Start em andamento");
        const pedidos = await this.pedidoController.obterEmAndamento();
        this.logger.trace("End em andamento");
        return pedidos;
    }

    @Get("/:id")
    @Returns(200, PedidoRetornoDto).Description("Pedido")
    async obterPorId(@PathParams("id") id: number): Promise<PedidoRetornoDto> {
        this.logger.info("Start pedidoId={}", id);
        const pedido = await this.pedidoController.obterPorId(id);
        this.logger.trace("End pedidoJson={}", pedido);
        return pedido;
    }

    @Post("")
    @Returns(201, PedidoCriarRetornoDto).Description("Pedido criado")
    async criar(@BodyParams() pedidoDto: PedidoCriarDto): Promise<PedidoCriarRetornoDto> {
        this.logger.info("Start pedidoJson={}", pedidoDto);
        const pedido = await this.pedidoController.criar(pedidoDto);
        this.logger.trace("End pedidoId={}", pedido?.id);
        return pedido;
    }

    @Patch("/:id/status")
    @Returns(200).Description("Nenhuma resposta")
    async atualizarStatus(@PathParams("id") id: number, @BodyParams() pedidoDto: PedidoStatusDto): Promise<void> {
        this.logger.info("Start id={}, pedidoJson={}", id, pedidoDto);
        if (pedidoDto.status === undefined) {
            throw new CamposObrigatoriosNaoPreechidoException("Status deve ser informado");
        }
        await this.pedidoController.atualizarStatus(id, StatusPedidoEnumMapper.stringParaEnum(pedidoDto.status as unknown as string));
        this.logger.trace("End pedidoId={}", id);
    }

    @Get()
    @Returns(200, Array).Of(PedidoRetornoDto)
    async obterPedidosPorStatus(
        @QueryParams("status") status: string,
        @QueryParams("identificadorPagamento") identificadorPagamento: string): Promise<PedidoRetornoDto[]> {
        this.logger.trace("Start status={}, identificadorPagamento={}", status, identificadorPagamento);

        const pedidos = await this.pedidoController.obterPorStatusAndIdentificadorPagamento(status, identificadorPagamento);
        this.logger.trace("End pedidosJson={}", pedidos);

        return pedidos;
    }

    @Get("/pagamentos/:idPagamento")
    @Returns(200, PedidoRetornoDto)
    async obterPedidosPorIdentificadorPagamento(@PathParams("idPagamento") idPagamento: string): Promise<PedidoRetornoDto> {
        this.logger.trace("Start identificadorPagamento={}", idPagamento);
        const pedido = await this.pedidoController.obterPorIdentificadorPagamento(idPagamento);
        this.logger.trace("End pedidoJson={}", pedido);
        return pedido;
    }

    @Get("/:idPedido/statusPagamento")
    @Returns(200, PedidoPagamentoDto)
    async consultarPagamentos(@PathParams("idPedido") idPedido: number): Promise<PedidoPagamentoDto> {
        this.logger.trace("Start identificadorPagamento={}", idPedido);
        const pedidoPagamentoDto = await this.pedidoController.consultaStatusPagamento(idPedido);
        this.logger.trace("End pedidoJson={}", pedidoPagamentoDto);
        return pedidoPagamentoDto;
    }
}