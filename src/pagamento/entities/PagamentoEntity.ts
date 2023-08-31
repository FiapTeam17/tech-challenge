import { PedidoEntity } from "@pedido/entities";
import { StatusPagamento } from "@pagamento/types";

export class PagamentoEntity {

    constructor(
        readonly id?: number,
        private pedido?: PedidoEntity,
        private status?: StatusPagamento
    ) {
    }

    static mapStatus(statusPagamento: string): StatusPagamento {
        switch (statusPagamento) {
            case "cancelled":
                return StatusPagamento.CANCELADO;
            case "refunded":
                return StatusPagamento.CANCELADO;
            case "charged_back":
                return StatusPagamento.CANCELADO;
            case "approved":
                return StatusPagamento.PAGO;
            case "rejected":
                return StatusPagamento.REJEITADO;
            default:
                return StatusPagamento.PENDENTE;
        }
    }
}