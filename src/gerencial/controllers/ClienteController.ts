import { DataSource } from "typeorm";
import { Logger } from "@tsed/logger";
import { IClienteRepositoryGateway } from "@gerencial/interfaces";
import { AlterarClienteUseCase, CriarClienteUseCase, ObterClienteUseCase } from "@gerencial/usecases";
import { ClienteMySqlRepositoryGateway } from "@gerencial/gateways";
import {
  AlterarClienteParamsDto,
  AlterarClienteReturnDto,
  ClienteDto,
  CriarClienteParamsDto,
  CriarClienteReturnDto
} from "@gerencial/dtos";


export class ClienteController {
  private readonly clienteRepositoryGateway: IClienteRepositoryGateway;
  private readonly obterClienteUseCase: ObterClienteUseCase;
  private readonly criarClienteUseCase: CriarClienteUseCase;
  private readonly alterarClienteUseCase: AlterarClienteUseCase;
  constructor(
    private dataSource: DataSource,
    private logger: Logger
  ) {
    this.clienteRepositoryGateway = new ClienteMySqlRepositoryGateway(dataSource, logger);
    this.obterClienteUseCase = new ObterClienteUseCase(this.clienteRepositoryGateway, logger);
    this.criarClienteUseCase = new CriarClienteUseCase(this.clienteRepositoryGateway, logger);
    this.alterarClienteUseCase = new AlterarClienteUseCase(this.clienteRepositoryGateway, logger);
  }

  async obterPorId(id: number): Promise<ClienteDto>{
    return await this.obterClienteUseCase.obterPorId(id);
  }

  async obterPorCpf(cpf: string): Promise<ClienteDto>{
    return await this.obterClienteUseCase.obterPorCpf(cpf);
  }

  async obterPorEmail(email: string): Promise<ClienteDto>{
    return await this.obterClienteUseCase.obterPorEmail(email);
  }

  async criar(dto: CriarClienteParamsDto): Promise<CriarClienteReturnDto>{
    return await this.criarClienteUseCase.criar(dto);
  }

  async alterar(requestDto: AlterarClienteParamsDto): Promise<AlterarClienteReturnDto>{
    return await this.alterarClienteUseCase.alterar(requestDto);
  }
}