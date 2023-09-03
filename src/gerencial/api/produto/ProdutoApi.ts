import { Controller } from "@tsed/di";
import { Delete, Get, Post, Put, Returns } from "@tsed/schema";
import { BodyParams, Inject, Logger, PathParams } from "@tsed/common";
import { MysqlDataSource } from "@database";
import { ProdutoController } from "@gerencial/controllers";
import { ProdutoAlterarDto, ProdutoCriarDto, ProdutoRetornoDto } from "@gerencial/dtos";

@Controller("")
export class ProdutoApi {

  private produtoController: ProdutoController;

  constructor(
    @Inject() private logger: Logger
  ) {
    this.produtoController = new ProdutoController(MysqlDataSource, logger);
  }
  @Get("/categorias/:categoria/produtos")
  @Returns(200, Array).Of(ProdutoRetornoDto)
  async obterPorCategoria(@PathParams("categoria") categoria: string): Promise<ProdutoRetornoDto[]> {
    console.log(categoria);
    const produtos = await this.produtoController.obterPorCategoria(categoria);
    return produtos;
  }

  @Get("/produtos/:id")
  @Returns(200, ProdutoRetornoDto)
  async obter(@PathParams("id") id: number): Promise<ProdutoRetornoDto> {
    const produto = await this.produtoController.obterPorId(id);
    return produto;
  }

  @Post("/produtos")
  @Returns(201).Description("ID do produto criado")
  async criar(@BodyParams() produtoDto: ProdutoCriarDto): Promise<ProdutoRetornoDto> {
    const returnDto = await this.produtoController.criar(produtoDto);
    return returnDto;
  }

  @Put("/produtos/:id")
  @Returns(200).Description("Nenhuma resposta")
  async alterar(@PathParams("id") id: number, @BodyParams() produtoDto: ProdutoAlterarDto): Promise<ProdutoRetornoDto> {
    produtoDto.id = id;
    const returnDto = await this.produtoController.alterar(produtoDto);
    return returnDto;
  }

  @Delete("/produtos/:id")
  @Returns(200).Description("Nenhuma resposta")
  async excluir(@PathParams("id") id: number): Promise<void> {
    return await this.produtoController.excluir(id);
  }
}