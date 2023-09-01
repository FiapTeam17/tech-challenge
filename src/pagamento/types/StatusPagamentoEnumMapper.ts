import { Exception } from "@tsed/exceptions";
import { StatusPagamento } from "./StatusPagamento";

export class StatusPagamentoEnumMapper {

    static stringParaEnum(opcao?: string): StatusPagamento {
        switch (opcao) {
            case "CANCELADO":
                return StatusPagamento.CANCELADO;
            case "PAGO":
                return StatusPagamento.PAGO;
            case "PENDENTE":
                return StatusPagamento.PENDENTE;
            case "REJEITADO":
                return StatusPagamento.REJEITADO;
            default:
                throw new Exception(500, "Status Inválido");
        }
    }

    static enumParaString(status?: StatusPagamento): string {

        switch (status) {
            case StatusPagamento.CANCELADO:
                return "CANCELADO";
            case StatusPagamento.PAGO:
                return "PAGO";
            case StatusPagamento.PENDENTE:
                return "PENDENTE";
            case StatusPagamento.REJEITADO:
                return "REJEITADO";
            default:
                throw new Exception(500, "Status Inválido");
        }
    }
}