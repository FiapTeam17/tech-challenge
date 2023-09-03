import { Controller } from "@tsed/di";
import { BodyParams, Inject, Logger, PathParams } from "@tsed/common";
import { Get, Post, Put, Returns } from "@tsed/schema";
import { MysqlDataSource } from "@database";
import { ClienteController } from "@gerencial/controllers";
import { ClienteAlterarDto, ClienteCriarDto, ClienteRetornoDto } from "@gerencial/dtos";


@Controller("/clientes")
export class ClienteApi {

  private clienteController: ClienteController
  constructor(
    @Inject() private logger: Logger
  ) {
    this.clienteController = new ClienteController(MysqlDataSource, logger);
  }

  @Get("/cpf/:cpf")
  @Returns(200, ClienteRetornoDto)
  @Returns(404).Description("Not found")
  async obterPorCpf(@PathParams("cpf") cpf: string) {
    const clienteDto = await this.clienteController.obterPorCpf(cpf);
    return clienteDto;
  }

  @Get("/email/:email")
  @Returns(200, ClienteRetornoDto)
  @Returns(404).Description("Not found")
  async obterPorEmail(@PathParams("email") email: string) {
    const clienteDto = await this.clienteController.obterPorEmail(email);
    return clienteDto;
  }

  @Get("/:id")
  @Returns(200, ClienteRetornoDto)
  @Returns(404).Description("Not found")
  async obterPorId(@PathParams("id") id: number) {
    const clienteDto = await this.clienteController.obterPorId(id);
    return clienteDto;
  }

  @Post("/")
  @Returns(201, ClienteRetornoDto)
  @Returns(404).Description("Not found")
  async criarCliente(@BodyParams() clienteDto: ClienteCriarDto) {
    const returnDto = await this.clienteController.criar(clienteDto);
    return returnDto;
  }

  @Put("/:id")
  @Returns(200)
  @Returns(404).Description("Not found")
  async alterarCliente(@BodyParams() clienteDto: ClienteAlterarDto, @PathParams("id") id: number){
    clienteDto.id = id;
    const returnDto = await this.clienteController.alterar(clienteDto);
    return returnDto;
  }
}