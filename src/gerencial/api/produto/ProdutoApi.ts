import { Controller } from "@tsed/di";
import { Delete, Get, Post, Put, Returns } from "@tsed/schema";
import { BodyParams, Inject, Logger, PathParams } from "@tsed/common";
import { MysqlDataSource } from "@database";
import { ProdutoJson } from "@gerencial/api";
import { ProdutoController } from "@gerencial/controllers";
import { AlterarProdutoParamsDto, CriarProdutoParamsDto } from "@gerencial/dtos";

@Controller("")
export class ProdutoApi {

  private produtoController: ProdutoController;

  constructor(
    @Inject() private logger: Logger
  ) {
    this.produtoController = new ProdutoController(MysqlDataSource, logger);
  }
  @Get("/categorias/:categoria/produtos")
  @Returns(200, Array<ProdutoJson>)
  async obterPorCategoria(@PathParams("categoria") categoria: string): Promise<ProdutoJson[]> {
    console.log(categoria);
    const produtos = await this.produtoController.obterPorCategoria(categoria);
    return produtos.map(p => new ProdutoJson(p));
  }

  @Get("/produtos/:id")
  @Returns(200, ProdutoJson)
  async obter(@PathParams("id") id: number): Promise<ProdutoJson> {
    const produto = await this.produtoController.obterPorId(id);
    return new ProdutoJson(produto);
  }

  @Post("/produtos")
  @Returns(201).Description("ID do produto criado")
  async criar(@BodyParams() produtoJson: ProdutoJson): Promise<string> {
    this.logger.trace("Start produtoJson={}", produtoJson);
    const returnDto = await this.produtoController.criar(new CriarProdutoParamsDto(produtoJson.getProdutoDto(null)));
    this.logger.trace("End id={}", returnDto.id);
    return `${returnDto.id}`;
  }

  @Put("/produtos/:id")
  @Returns(200).Description("Nenhuma resposta")
  async alterar(@PathParams("id") id: number, @BodyParams() produtoJson: ProdutoJson): Promise<void> {
    this.logger.trace("Start id={}, produtoJson={}", id, produtoJson);
    await this.produtoController.alterar(new AlterarProdutoParamsDto(produtoJson.getProdutoDto(id)));
    this.logger.trace("End");
  }

  @Delete("/produtos/:id")
  @Returns(200).Description("Nenhuma resposta")
  async excluir(@PathParams("id") id: number): Promise<void> {
    return await this.produtoController.excluir(id);
  }
}