import { Logger } from "@tsed/common";
import { DataSource, Equal, Repository } from "typeorm";
import { Optional } from "typescript-optional";
import { IPagamentoRepositoryGateway } from "@pagamento/interfaces";
import { PagamentoDto } from "@pagamento/dtos";
import { ErrorToAccessDatabaseException } from "@common";
import { PagamentoModel } from "@pagamento/gateways/models";

export class PagamentoMySqlRepositoryGateway implements IPagamentoRepositoryGateway {

    protected pagamentoRepository: Repository<PagamentoModel>;

    constructor(
        private dataSource: DataSource,
        private logger: Logger
    ) {
        this.pagamentoRepository = this.dataSource.getRepository(PagamentoModel);
    }

    async salvar(pagamentoDto: PagamentoDto): Promise<PagamentoDto> {
        try {
            const pagamentoEntityCreated = await this.pagamentoRepository.save(PagamentoModel.getInstancia(pagamentoDto));
            pagamentoDto.id = pagamentoEntityCreated.id;

            return pagamentoDto
        } catch (e) {
            this.logger.error(e);
            throw new ErrorToAccessDatabaseException();
        }
    }

    async atualizarStatus(pagamento: PagamentoDto): Promise<void> {
        try {
            const pagamentoId = pagamento.id as number;
            await this.pagamentoRepository.update(pagamentoId, {
                status: pagamento?.status?.toString()
            });
        } catch (e) {
            this.logger.error(e);
            throw new ErrorToAccessDatabaseException();
        }
    }

    async atualizarCodigoPagamento(pagamento: PagamentoDto): Promise<void> {
        try {
            const pagamentoId = pagamento.id as number;
            await this.pagamentoRepository.update(pagamentoId, {
                codigoPagamento: pagamento?.codigoPagamento?.toString()
            });
        } catch (e) {
            this.logger.error(e);
            throw new ErrorToAccessDatabaseException();
        }
    }

    async obterPorPedidoId(pedidoId: number): Promise<PagamentoDto[]> {
        try {
            const pagamentosEntities = await this.pagamentoRepository.findBy({ pedido: Equal(pedidoId) });
            const pagamentosDto = pagamentosEntities.map(pag => pag.getDto());
            return pagamentosDto;
        } catch (e) {
            this.logger.error(e);
            throw new ErrorToAccessDatabaseException();
        }
    }

    async obterPorPedidoIdECodigoPagamento(pedidoId: number, identificador: string): Promise<Optional<PagamentoDto>> {
        try {
            const pagamentoEntity = await this.pagamentoRepository.findOneBy({
                pedido: Equal(pedidoId),
                codigoPagamento: identificador
            });
            const pagamentosDto = pagamentoEntity?.getDto();
            return Optional.ofNullable(pagamentosDto);
        } catch (e) {
            this.logger.error(e);
            throw new ErrorToAccessDatabaseException();
        }
    }

    async obterPorCodigoPagamento(identificador: string): Promise<Optional<PagamentoDto>> {
        try {
            const pagamentosEntities = await this.pagamentoRepository.findOneBy({ codigoPagamento: Equal(identificador) });
            const pagamentosDto = pagamentosEntities?.getDto();
            return Optional.ofNullable(pagamentosDto);
        } catch (e) {
            this.logger.error(e);
            throw new ErrorToAccessDatabaseException();
        }
    }

    async obterPorId(pagamentoId: number): Promise<Optional<PagamentoDto>> {
        try {
            const pagamentosEntities = await this.pagamentoRepository.findOneBy({ id: Equal(pagamentoId) });
            if(pagamentosEntities != null) {
                const pagamentosDto = pagamentosEntities.getDto();
                return Optional.ofNullable(pagamentosDto);
            }

            return Optional.empty();
        } catch (e) {
            this.logger.error(e);
            throw new ErrorToAccessDatabaseException();
        }
    }
}