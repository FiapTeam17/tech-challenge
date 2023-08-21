import { PedidoConsultaDto, PedidoEmAndamentoDto } from "../../dtos";
import { PedidoPagamentoDto } from "../../dtos/PedidoPagamentoDto";

export const IObterPedidoUseCase: unique symbol = Symbol("IObterPedidoUseCase");

export interface IObterPedidoUseCase {
    obterPorId(id: number): Promise<PedidoConsultaDto>;

    obterEmAndamento(): Promise<PedidoEmAndamentoDto[]>;

    obterPorStatusAndIdentificadorPagamento(status: string, identificadorPagamento: string): Promise<PedidoConsultaDto[]>;

    obterPorIdentificadorPagamento(identificadorPagamento: string): Promise<PedidoConsultaDto>;

    consultaStatusPagamento(idPedido: number): Promise<PedidoPagamentoDto>;
}