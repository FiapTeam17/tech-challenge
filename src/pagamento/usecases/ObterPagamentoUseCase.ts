import { IObterPagamentoUseCase, IPagamentoRepositoryGateway } from "@pagamento/interfaces";
import { Logger } from "@tsed/common";
import { Optional } from "typescript-optional";
import { PagamentoDto } from "@pagamento/dtos";

export class ObterPagamentoUseCase implements IObterPagamentoUseCase {

    constructor(
      private pagamentoRepositoryGateway: IPagamentoRepositoryGateway,
      private logger: Logger
    ) {
    }

    async obtemPagamentoPorPedidoId(pedidoId: number): Promise<Optional<PagamentoDto[]>> {
        return await this.pagamentoRepositoryGateway.obterPorPedidoId(pedidoId);
    }
}