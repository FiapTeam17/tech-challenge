import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { Logger } from "@tsed/common";
import { ErrorToAccessDatabaseException } from "../../../../common/exception/ErrorToAccessDatabaseException";
import { PAGAMENTO_DATABASE_REPOSITORY } from "../../../../config/database/repository/repository-register.provider";
import { IPagamentoRepositoryGateway } from "../../../../pagamento/core/application/ports/IPagamentoRepositoryGateway";
import { PagamentoDto } from "../../../../pagamento/core/dto/PagamentoDto";
import { PagamentoEntity } from "./entities/PagamentoEntity";
import { StatusPedido, StatusPedidoEnumMapper } from "../../../../pedido";
import { Equal } from "typeorm";
import { Optional } from "typescript-optional";

@Injectable({
    type: ProviderType.SERVICE,
    scope: ProviderScope.REQUEST,
    provide: IPagamentoRepositoryGateway
})
export class PagamentoMySqlRepositoryGateway implements IPagamentoRepositoryGateway {
    @Inject()
    logger: Logger;

    @Inject(PAGAMENTO_DATABASE_REPOSITORY)
    protected pagamentoRepository: PAGAMENTO_DATABASE_REPOSITORY;

    async criar(pagamentoDto: PagamentoDto): Promise<number | undefined> {
        try {
            this.logger.trace("Start pagamento={}", pagamentoDto);

            const pagamentoEntityCreated = await this.pagamentoRepository.save(PagamentoEntity.getInstancia(pagamentoDto));
            const pagamentoEntityCreatedId = pagamentoEntityCreated.id;

            this.logger.trace("End pagamentoEntityCreatedId={}", pagamentoEntityCreatedId);
            return pagamentoEntityCreatedId;
        } catch (e) {
            console.log(e);
            this.logger.error(e);
            throw new ErrorToAccessDatabaseException();
        }
    }

    async obterPorPedidoId(pedidoId: number): Promise<Optional<PagamentoDto[]>> {
        try {
            this.logger.trace("Start pagamento={}", pedidoId);
            const pagamentosEntities = await this.pagamentoRepository.findBy({ pedido: Equal(pedidoId) });
            const pagamentosDto = pagamentosEntities.map(pag => pag.getDto());
            this.logger.trace("End obterPorPedidoId={}", pedidoId);
            return Optional.ofNullable(pagamentosDto);
        } catch (e) {
            console.log(e);
            this.logger.error(e);
            throw new ErrorToAccessDatabaseException();
        }
    }
}