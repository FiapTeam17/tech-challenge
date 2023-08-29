import { Logger } from "@tsed/common";
import { Optional } from "typescript-optional";
import { DataSource, Repository } from "typeorm";
import { ErrorToAccessDatabaseException } from "@common";
import { IPedidoRepositoryGateway } from "@pedido/interfaces";
import { PedidoDto } from "@pedido/dtos";
import { PedidoItemModel, PedidoModel } from "@pedido/gateways/models";
import { StatusPedidoEnumMapper } from "@pedido/types";
import { StatusPedido } from "@pedido/entities";

export class PedidoMySqlRepositoryGateway implements IPedidoRepositoryGateway {

  private pedidoRepository: Repository<PedidoModel>;
  //private pagamentoRepository: Repository<PedidoEntity>;
  private pedidoItemRepository: Repository<PedidoItemModel>;

  constructor(
    private dataSource: DataSource,
    private logger: Logger
  ) {
    this.pedidoRepository = dataSource.getRepository(PedidoModel);
    this.pedidoItemRepository = dataSource.getRepository(PedidoItemModel);
  }

  async criar(pedido: PedidoDto): Promise<number | undefined> {
    try {
      this.logger.trace("Start pedido={}", pedido);
      //TODO adicionar controle de transação
      const pedidoEntity = new PedidoModel(pedido);
      const pedidoEntityCreated = await this.pedidoRepository.save(pedidoEntity);
      const pedidoCreatedId = pedidoEntityCreated.id;

      if (pedidoEntity.itens) {
        for (let i = 0; i < pedidoEntity.itens.length; i++) {
          const item = pedidoEntity.itens[i];
          item.pedido = pedidoEntityCreated;
          await this.pedidoItemRepository.save(item);
        }
      }

      this.logger.trace("End pedidoCreatedId={}", pedidoCreatedId);
      return pedidoCreatedId;

    } catch (e) {

      this.logger.error(e);
      throw new ErrorToAccessDatabaseException();
    }
  }

  async atualizarStatus(pedido: PedidoDto): Promise<void> {
    try {
      this.logger.trace("Start pedido={}", pedido);
      const pedidoId = pedido.id as number;
      await this.pedidoRepository.update(pedidoId, {
        status: StatusPedidoEnumMapper.enumParaString(pedido.status)
      });
      this.logger.trace("End");
    }
    catch (e) {

      this.logger.error(e);
      throw new ErrorToAccessDatabaseException();
    }
  }

  async obterEmAndamento(): Promise<Optional<PedidoDto[]>> {
    try {
      this.logger.trace("Start em andamento");
      const pedidos: PedidoDto[] = [];

      const pedidoEntity = await this.pedidoRepository
        .createQueryBuilder("ped")
        .where("ped.status in(:...status)", {
          status: [
            StatusPedidoEnumMapper.enumParaString(StatusPedido.EM_PREPARACAO)
          ]
        })
        .getMany();

      pedidoEntity.forEach(pe => {
        pedidos.push(pe.getDto());
      });

      return Optional.of(pedidos);
    }
    catch (e) {
      this.logger.error(e);
      throw new ErrorToAccessDatabaseException();
    }
  }

  async obterPorId(pedidoId: number): Promise<Optional<PedidoDto>> {
    try {
      this.logger.trace("Start id={}", pedidoId);
      const pedidoEntity = await this.pedidoRepository
        .createQueryBuilder("ped")
        .where("ped.Id = :id", {
          id: pedidoId
        })
        .leftJoinAndSelect('ped.cliente', 'cli')
        .leftJoinAndSelect('ped.itens', 'item')
        .leftJoinAndSelect('item.produto', 'prod')
        .leftJoinAndSelect('item.pedido', 'peditem')
        .getOne();
      return Optional.ofNullable(pedidoEntity?.getDto());
    } catch (e) {
      this.logger.error(e);
      throw new ErrorToAccessDatabaseException();
    }
  }

  async obterPorStatusAndIdentificadorPagamento(status: StatusPedido, identificadorPagamento: string): Promise<PedidoDto[]> {
    try {
      this.logger.trace("Start status={}, identificadorPagamento={}", status, identificadorPagamento);
      const pedidos: PedidoDto[] = [];

      //TODO: implementar filtro de "identificadorPagamento"

      const pedidoEntity = await this.pedidoRepository
        .createQueryBuilder("ped")
        .where("ped.status = :status", {
          status: StatusPedidoEnumMapper.enumParaString(status)
        }).getMany();

      pedidoEntity.forEach(pe => {
        pedidos.push(pe.getDto());
      })

      this.logger.trace("End pedidos={}", pedidos);
      return pedidos;
    } catch (error) {
      this.logger.error(error);
      throw new ErrorToAccessDatabaseException();
    }
  }

  async obterPorIdentificadorPagamento(identificadorPagamento: string): Promise<Optional<PedidoDto>> {
    try {
      // this.logger.trace("Start identificadorPagamento={}", identificadorPagamento);
      //
      // const pagamento = await this.pagamentoRepository.findOneBy({
      //   codigoPagamento: identificadorPagamento
      // });
      //
      // let pedidoOp: Optional<PedidoDto> = Optional.empty();
      // if (pagamento !== null && pagamento.pedido !== undefined) {
      //   const pedidoEntity = pagamento.pedido;
      //   pedidoOp = Optional.of(pedidoEntity.getDto());
      // }
      //
      // this.logger.trace("End pedidoOp={}", pedidoOp)
      // return pedidoOp;
      return Optional.empty();
    }
    catch (e) {
      this.logger.error(e);
      throw new ErrorToAccessDatabaseException();
    }
  }
}