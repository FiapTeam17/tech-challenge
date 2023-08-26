import { Logger } from "@tsed/common";
import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { Optional } from "typescript-optional";
import axios from "axios";
import { IPagamentoMpServiceHttpGateway } from "../../../core/application/ports/IPagamentoServiceHttpGateway";
import { PagamentoMercadoPagoDto } from "../../../core/dto/PagamentoMercadoPagoDto";
import {
    ErrorToAccessPagamentoServicoExternoException
} from "../../../core/application/exceptions/ErrorToAccessPagamentoServicoExternoException";

@Injectable({
    type: ProviderType.SERVICE,
    scope: ProviderScope.REQUEST,
    provide: IPagamentoMpServiceHttpGateway
})
export class PagamentoMpServiceHttpGateway implements IPagamentoMpServiceHttpGateway {
    @Inject()
    private logger: Logger;
    private readonly clientServiceUrlBase: string = "https://api.mercadopago.com";//FIXME: usar arquivo properties

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