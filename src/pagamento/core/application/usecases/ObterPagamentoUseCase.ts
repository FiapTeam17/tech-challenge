import { Inject, Logger } from "@tsed/common";
import { Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { IPagamentoRepositoryGateway } from "../ports";
import { PagamentoDto } from "../../dto/PagamentoDto";
import { IObterPagamentoUseCase } from "./IObterPagamentoUseCase";
import { Optional } from "typescript-optional";

@Injectable({
    type: ProviderType.SERVICE,
    scope: ProviderScope.REQUEST,
    provide: IObterPagamentoUseCase
})
export class ObterPagamentoUseCase implements IObterPagamentoUseCase {

    constructor(
        @Inject() private logger: Logger,
        @Inject(IPagamentoRepositoryGateway) private pagamentoRepositoryGateway: IPagamentoRepositoryGateway
    ) {
    }

    async obtemPagamentoPorPedidoId(pedidoId: number): Promise<Optional<PagamentoDto[]>> {
        return await this.pagamentoRepositoryGateway.obterPorPedidoId(pedidoId);
    }
}