import { PedidoCadastroDto, PedidoConsultaDto } from "@pedido/dtos";

export const ICriarPedidoUseCase: unique symbol = Symbol("ICriarPedidoUseCase");

export interface ICriarPedidoUseCase {
    criar(pedido: PedidoCadastroDto): Promise<PedidoConsultaDto>;
}