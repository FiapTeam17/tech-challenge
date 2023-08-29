import { Controller } from "@tsed/di";
import { BodyParams, Inject, Logger, PathParams } from "@tsed/common";
import { Get, Post, Put, Returns } from "@tsed/schema";
import { ClienteJson } from "@gerencial/api";
import { MysqlDataSource } from "@database";
import { ClienteController } from "@gerencial/controllers";
import { AlterarClienteParamsDto, CriarClienteParamsDto } from "@gerencial/dtos";

@Controller("/clientes")
export class ClienteApi {

  private clienteController: ClienteController
  constructor(
    @Inject() private logger: Logger
  ) {
    this.clienteController = new ClienteController(MysqlDataSource, logger);
  }
  @Get("/cpf/:cpf")
  @Returns(200, ClienteJson)
  @Returns(404).Description("Not found")
  async obterPorCpf(@PathParams("cpf") cpf: string) {
    this.logger.trace("Start cpf={}", cpf);
    const cliente = await this.clienteController.obterPorCpf(cpf);
    const clientJson = new ClienteJson(cliente);
    this.logger.trace("End clientJson={}", clientJson);
    return clientJson;
  }

  @Get("/email/:email")
  @Returns(200, ClienteJson)
  @Returns(404).Description("Not found")
  async obterPorEmail(@PathParams("email") email: string) {
    const cliente = await this.clienteController.obterPorEmail(email);

    return new ClienteJson(cliente);
  }

  @Get("/:id")
  @Returns(200, ClienteJson)
  @Returns(404).Description("Not found")
  async obterPorId(@PathParams("id") id: number) {
    const cliente = await this.clienteController.obterPorId(id);
    return new ClienteJson(cliente);
  }

  @Post("/")
  @Returns(201, ClienteJson)
  @Returns(404).Description("Not found")
  async criarCliente(@BodyParams() cliente: ClienteJson) {
    this.logger.trace("Start cliente={}", cliente);
    const returnDto = await this.clienteController.criar(new CriarClienteParamsDto(cliente.getDto()));
    this.logger.trace("End clienteId={}", returnDto.clienteId);
    cliente.id = returnDto.clienteId;
    return cliente;
  }

  @Put("/:id")
  @Returns(200)
  @Returns(404).Description("Not found")
  async alterarCliente(@BodyParams() clienteJson: ClienteJson, @PathParams("id") id: number){
    this.logger.trace("Start cliente={}, id={}", clienteJson, id);
    await this.clienteController.alterar(new AlterarClienteParamsDto(clienteJson.getDto(id)));
    this.logger.trace("End");
  }

}