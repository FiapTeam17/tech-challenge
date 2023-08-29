import { Logger } from "@tsed/common";
import { DataSource } from "typeorm";
import {
  AlterarProdutoParamsDto,
  AlterarProdutoReturnDto,
  CriarProdutoParamsDto,
  CriarProdutoReturnDto,
  ProdutoDto
} from "../dtos";
import { IProdutoRepositoryGateway } from "../interfaces";
import { ProdutoMySqlRepositoryGateway } from "../gateways";
import { AlterarProdutoUseCase, CriarProdutoUseCase, ExcluirProdutoUseCase, ObterProdutoUseCase } from "../usecases";

export class ProdutoController {
  private readonly produtoRepositoryGateway: IProdutoRepositoryGateway;
  private readonly obterProdutoUseCase: ObterProdutoUseCase;
  private readonly criarProdutoUseCase: CriarProdutoUseCase;
  private readonly alterarProdutoUseCase: AlterarProdutoUseCase;
  private readonly excluirProdutoUseCase: ExcluirProdutoUseCase;

  constructor(
    private dataSource: DataSource,
    private logger: Logger
  ) {
    this.produtoRepositoryGateway = new ProdutoMySqlRepositoryGateway(dataSource, logger);
    this.obterProdutoUseCase = new ObterProdutoUseCase(this.produtoRepositoryGateway, logger);
    this.criarProdutoUseCase = new CriarProdutoUseCase(this.produtoRepositoryGateway, logger);
    this.alterarProdutoUseCase = new AlterarProdutoUseCase(this.produtoRepositoryGateway, logger);
    this.excluirProdutoUseCase = new ExcluirProdutoUseCase(this.produtoRepositoryGateway, logger);
  }

  async obterPorId(id: number): Promise<ProdutoDto>{
    return await this.obterProdutoUseCase.obterPorId(id);
  }

  async obterPorCategoria(categoria: string): Promise<ProdutoDto[]> {
    return await this.obterProdutoUseCase.obterPorCategoria(categoria);
  }

  async criar(dto: CriarProdutoParamsDto): Promise<CriarProdutoReturnDto>{
    return await this.criarProdutoUseCase.criar(dto);
  }

  async alterar(dto: AlterarProdutoParamsDto): Promise<AlterarProdutoReturnDto>{
    return await this.alterarProdutoUseCase.alterar(dto);
  }

  async excluir(id: number): Promise<void>{
    return await this.excluirProdutoUseCase.excluir(id);
  }
}