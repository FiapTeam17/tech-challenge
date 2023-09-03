import { Logger } from "@tsed/common";
import { DataSource, In, Repository } from "typeorm";
import { Optional } from "typescript-optional";
import { ErrorToAccessDatabaseException } from "@common";
import { ClienteAlterarDto, ClienteRetornoDto, ClienteDto } from "@gerencial/dtos";
import { IClienteRepositoryGateway } from "@gerencial/interfaces";
import { ClienteModel } from "@gerencial/gateways/models";

export class ClienteMySqlRepositoryGateway implements IClienteRepositoryGateway {

    private clienteRepository: Repository<ClienteModel>;

    constructor(
      private dataSource: DataSource,
      private logger: Logger
    ) {
        this.clienteRepository = this.dataSource.getRepository(ClienteModel);
    }

    async alterar(dto: ClienteAlterarDto): Promise<ClienteRetornoDto> {
        try {
            const clienteModel = await this.clienteRepository.save(new ClienteModel(dto));
            return clienteModel.getClientDto();

        } catch (e) {
            this.logger.error(e);
            throw new ErrorToAccessDatabaseException();
        }
    }

    async criar(dto: ClienteDto): Promise<ClienteRetornoDto> {
        try {
            const clienteModel = await this.clienteRepository.save(new ClienteModel(dto));
            return clienteModel.getClientDto();
        } catch (e) {
            this.logger.error(e);
            throw new ErrorToAccessDatabaseException();
        }
    }

    async obterPorCpf(cpf: string): Promise<Optional<ClienteDto>> {
        try {
            this.logger.trace("Start cpf={}", cpf);
            const clienteEntity = await this.clienteRepository.findOneBy(
                {
                    cpf: In([cpf])
                });

            const clienteDtoOp = Optional.ofNullable(clienteEntity?.getClientDto());
            this.logger.trace("End clienteDtoOp={}", clienteDtoOp);
            return clienteDtoOp;
        } catch (e) {
            this.logger.error(e);
            throw new ErrorToAccessDatabaseException();
        }
    }

    async obterPorEmail(email: string): Promise<Optional<ClienteDto>> {
        try {
            this.logger.trace("Start email={}", email);
            const clienteEntity = await this.clienteRepository.findOneBy(
                {
                    email: In([email])
                });

            const clienteDtoOp = Optional.ofNullable(clienteEntity?.getClientDto());
            this.logger.trace("End clienteDtoOp={}", clienteDtoOp);
            return clienteDtoOp;
        } catch (e) {
            this.logger.error(e);
            throw new ErrorToAccessDatabaseException();
        }
    }

    async obterPorId(id: number): Promise<Optional<ClienteDto>> {
        try {
            this.logger.trace("Start id={}", id);
            const clienteEntity = await this.clienteRepository.findOneBy(
                {
                    id: In([id])
                });

            const clienteDtoOp = Optional.ofNullable(clienteEntity?.getClientDto());
            this.logger.trace("End clienteDtoOp={}", clienteDtoOp);
            return clienteDtoOp;
        } catch (e) {
            this.logger.error(e);
            throw new ErrorToAccessDatabaseException();
        }
    }
}