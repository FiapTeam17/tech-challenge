import { DataSource } from "typeorm";
import { Logger } from "@tsed/logger";
import {
  IAlterarClienteUseCase,
  IClienteRepositoryGateway,
  ICriarClienteUseCase,
  IObterClienteUseCase
} from "@gerencial/interfaces";
import { AlterarClienteUseCase, CriarClienteUseCase, ObterClienteUseCase } from "@gerencial/usecases";
import { ClienteMySqlRepositoryGateway } from "@gerencial/gateways";
import { ClienteAlterarDto, ClienteCriarDto, ClienteRetornoDto } from "@gerencial/dtos";


export class ClienteController {
  private readonly clienteRepositoryGateway: IClienteRepositoryGateway;
  private readonly obterClienteUseCase: IObterClienteUseCase;
  private readonly criarClienteUseCase: ICriarClienteUseCase;
  private readonly alterarClienteUseCase: IAlterarClienteUseCase;
  constructor(
    private dataSource: DataSource,
    private logger: Logger
  ) {
    this.clienteRepositoryGateway = new ClienteMySqlRepositoryGateway(dataSource, logger);
    this.obterClienteUseCase = new ObterClienteUseCase(this.clienteRepositoryGateway, logger);
    this.criarClienteUseCase = new CriarClienteUseCase(this.clienteRepositoryGateway, logger);
    this.alterarClienteUseCase = new AlterarClienteUseCase(this.clienteRepositoryGateway, logger);
  }

  async obterPorId(id: number): Promise<ClienteRetornoDto>{
    return await this.obterClienteUseCase.obterPorId(id);
  }

  async obterPorCpf(cpf: string): Promise<ClienteRetornoDto>{
    return await this.obterClienteUseCase.obterPorCpf(cpf);
  }

  async obterPorEmail(email: string): Promise<ClienteRetornoDto>{
    return await this.obterClienteUseCase.obterPorEmail(email);
  }

  async criar(dto: ClienteCriarDto): Promise<ClienteRetornoDto>{
    return await this.criarClienteUseCase.criar(dto);
  }

  async alterar(requestDto: ClienteAlterarDto): Promise<ClienteRetornoDto>{
    return await this.alterarClienteUseCase.alterar(requestDto);
  }
}