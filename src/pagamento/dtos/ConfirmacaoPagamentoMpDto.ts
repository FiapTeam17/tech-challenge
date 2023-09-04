import { Description, Example, Property } from "@tsed/schema";

export class ConfirmacaoPagamentoMpDto {
    @Description("")
    @Example("test.created")
    @Property()
    action: string;

    @Description("")
    @Example("v1")
    @Property()
    api_version: string;

    @Description("")
    @Example("8375344102018334")
    @Property()
    application_id: string;

    @Description("")
    @Example("2021-01-01 02:02:02 +0000 UTC")
    @Property()
    date_created: string;

    @Description("")
    @Example("123456")
    @Property()
    id: string;

    @Description("")
    @Example("false")
    @Property()
    live_mode: string;

    @Description("")
    @Example("test")
    @Property()
    type: string;

    @Description("")
    @Example("29575195")
    @Property()
    user_id: number;

    data: Data;
}

export class Data {
    @Description("Código de identificação do pagamento")
    @Example("123456789")
    @Property()
    id: string;
}
