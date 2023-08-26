import { Pedido } from "../../../pedido";
import { CartaoCredito } from "./CartaoCredito";
import { SistemaExterno } from "./SistemaExterno";
import { StatusPagamento } from "./StatusPagamento";
import { Optional } from "typescript-optional";

export class Pagamento {

    private sistemaExterno?: SistemaExterno;

    constructor(
        readonly id?: number,
        private pedido?: Pedido,
        readonly cartoesCredito?: CartaoCredito[],
        private status?: StatusPagamento,
    ) {
    }

    setIdentificadorPagamentoExterno(identificadorPagamento: string) {
        this.sistemaExterno = new SistemaExterno(identificadorPagamento);
    }

    getIdentificadorPagamentoExterno(): string | undefined {
        return this.sistemaExterno?.identificadorPagamento;
    }

    setPedido(pedido: Pedido) {
        this.pedido = pedido;
    }

    getPedido(): Pedido | undefined {
        return this.pedido;
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