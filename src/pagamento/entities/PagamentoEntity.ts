import { Optional } from "typescript-optional";
import { PedidoEntity } from "@pedido/entities";
import { StatusPagamento } from "@pagamento/types";

export class PagamentoEntity {

    constructor(
        readonly id?: number,
        private pedido?: PedidoEntity,
        private status?: StatusPagamento,
    ) {
    }

    static mapStatus(statusPagamento: string): Optional<StatusPagamento> {
        switch (statusPagamento) {
            case "pending":
                return Optional.of(StatusPagamento.PENDENTE);
            case "approved":
                return Optional.of(StatusPagamento.PAGO);
            case "rejected":
                return Optional.of(StatusPagamento.REJEITADO);
            default:
                return Optional.empty();
        }
    }
}