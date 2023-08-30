import { Optional } from "typescript-optional";
import { Logger } from "@tsed/logger";
import { IAtualizarStatusPedidoUseCase, IPedidoRepositoryGateway } from "@pedido/interfaces";
import { PedidoEntity, StatusPedido } from "@pedido/entities";
import { PedidoDto } from "@pedido/dtos";
import { PedidoNotFoundException } from "./exceptions/PedidoNotFoundException";

export class AtualizarStatusPedidoUseCase implements IAtualizarStatusPedidoUseCase{
    constructor(
        private pedidoRepositoryGateway: IPedidoRepositoryGateway,
        private logger: Logger) { }

    async atualizarStatus(pedidoId: number, status: StatusPedido): Promise<void> {
        this.logger.trace("Start id={}", pedidoId);
        const pedidoOp: Optional<PedidoDto> = await this.pedidoRepositoryGateway.obterPorId(pedidoId);
        if (pedidoOp.isEmpty()) {
            this.logger.warn("Pedido id={} não encontrado", pedidoId);
            throw new PedidoNotFoundException();
        }
        const pedidoDto = pedidoOp.get();
        const pedido = PedidoEntity.getInstance(pedidoDto);
        pedido.setStatus(status);
        await this.pedidoRepositoryGateway.atualizarStatus(pedido.toPedidoDto());
        this.logger.trace("End");
    }
}