import { StatusPagamento } from "@pagamento/types";

export class PagamentoDto {
    constructor(
        public readonly id?: number,
        public pedidoId?: number,
        private identificadorPagamentoExterno?: string,
        public status?: StatusPagamento
    ) {
    }

    public getIdentificadorPagamentoExterno(): string | undefined {
        return this.identificadorPagamentoExterno;
    }

}