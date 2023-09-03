import { Logger } from "@tsed/common";
import { DataSource } from "typeorm";
import {
  IAlterarProdutoUseCase,
  ICriarProdutoUseCase,
  IExcluirProdutoUseCase,
  IObterProdutoUseCase,
  IProdutoRepositoryGateway
} from "@gerencial/interfaces";
import {
  AlterarProdutoUseCase,
  CriarProdutoUseCase,
  ExcluirProdutoUseCase,
  ObterProdutoUseCase
} from "@gerencial/usecases";
import { ProdutoMySqlRepositoryGateway } from "@gerencial/gateways";
import { ProdutoAlterarDto, ProdutoCriarDto, ProdutoRetornoDto } from "@gerencial/dtos";


export class ProdutoController {
  private readonly produtoRepositoryGateway: IProdutoRepositoryGateway;
  private readonly obterProdutoUseCase: IObterProdutoUseCase;
  private readonly criarProdutoUseCase: ICriarProdutoUseCase;
  private readonly alterarProdutoUseCase: IAlterarProdutoUseCase;
  private readonly excluirProdutoUseCase: IExcluirProdutoUseCase;

  constructor(
    private dataSource: DataSource,
    private logger: Logger
  ) {
    this.produtoRepositoryGateway = new ProdutoMySqlRepositoryGateway(this.dataSource, this.logger);
    this.obterProdutoUseCase = new ObterProdutoUseCase(this.produtoRepositoryGateway, this.logger);
    this.criarProdutoUseCase = new CriarProdutoUseCase(this.produtoRepositoryGateway, this.logger);
    this.alterarProdutoUseCase = new AlterarProdutoUseCase(this.produtoRepositoryGateway, this.logger);
    this.excluirProdutoUseCase = new ExcluirProdutoUseCase(this.produtoRepositoryGateway, this.logger);
  }

  async obterPorId(id: number): Promise<ProdutoRetornoDto>{
    return await this.obterProdutoUseCase.obterPorId(id);
  }

  async obterPorCategoria(categoria: string): Promise<ProdutoRetornoDto[]> {
    return await this.obterProdutoUseCase.obterPorCategoria(categoria);
  }

  async criar(dto: ProdutoCriarDto): Promise<ProdutoRetornoDto>{
    return await this.criarProdutoUseCase.criar(dto);
  }

  async alterar(dto: ProdutoAlterarDto): Promise<ProdutoRetornoDto>{
    return await this.alterarProdutoUseCase.alterar(dto);
  }

  async excluir(id: number): Promise<void>{
    return await this.excluirProdutoUseCase.excluir(id);
  }
}