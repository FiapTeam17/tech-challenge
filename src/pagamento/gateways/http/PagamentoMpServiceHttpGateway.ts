import { IPagamentoMpServiceHttpGateway } from "@pagamento/interfaces";
import axios from "axios";
import { Logger } from "@tsed/common";
import { Optional } from "typescript-optional";
import { PagamentoMercadoPagoDto } from "@pagamento/dtos";
import { ErrorToAccessPagamentoServicoExternoException } from "@pagamento/usecases/exceptions";

export class PagamentoMpServiceHttpGateway implements IPagamentoMpServiceHttpGateway {

    private readonly clientServiceUrlBase: string = "https://api.mercadopago.com";//FIXME: usar arquivo properties

    constructor(
      private logger: Logger
    ){

    }
    async obterPagamento(identificadorPagamento: string): Promise<Optional<PagamentoMercadoPagoDto>> {
        try {
            const config = {
                method: "get",
                maxBodyLength: Infinity,
                url: `${this.clientServiceUrlBase}/v1/payments/${identificadorPagamento}`,
                headers: {}
            };

            this.logger.info("Try connect mercadopago. config={}", config);
            const response = await axios.request<Optional<PagamentoMercadoPagoDto>>(config);
            this.logger.info("response={}", response);
            return response.data;
        } catch (error) {
            this.logger.warn("Erro ao obter pagamento no Mercado Pago. identificadorPagamento={}", identificadorPagamento);
            throw new ErrorToAccessPagamentoServicoExternoException();
        }
    }
}