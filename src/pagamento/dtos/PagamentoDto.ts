import { StatusPagamento } from "@pagamento/types";

export class PagamentoDto {
    constructor(
        public readonly id?: number,
        public pedidoId?: number,
        public codigoPagamento?: string,
        public status?: StatusPagamento,
        public qrCode?: string,
    ) {
    }
}