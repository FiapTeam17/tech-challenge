import { Description, Example, Property, Required } from "@tsed/schema";

export class ClienteDto {

    @Description("Identificador")
    @Example("123456")
    @Property()
    public id?: number;

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

    constructor(nome?: string, cpf?: string, email?: string, id?: number) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
    }
}