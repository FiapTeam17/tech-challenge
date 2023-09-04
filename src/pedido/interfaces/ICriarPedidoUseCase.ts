import { PedidoCriarDto } from "@pedido/dtos";
import { PedidoCriarRetornoDto } from "@pedido/dtos/PedidoCriarRetornoDto";

export const ICriarPedidoUseCase: unique symbol = Symbol("ICriarPedidoUseCase");

export interface ICriarPedidoUseCase {
    criar(pedido: PedidoCriarDto): Promise<PedidoCriarRetornoDto>;
}