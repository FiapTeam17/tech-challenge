import { Description, Example, Property, Required } from "@tsed/schema";

export class ClienteCriarDto {

    @Description("Nome do cliente")
    @Example("Cliente teste")
    @Property()
    public readonly nome?: string;

    @Description("CPF")
    @Example("12345678909")
    @Required()
    @Property()
    public readonly cpf?: string;

    @Description("E-mail")
    @Example("cliente@teste.com.br")
    @Property()
    public readonly email?: string;

}