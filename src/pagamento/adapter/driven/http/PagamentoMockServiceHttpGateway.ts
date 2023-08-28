import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { Logger } from "@tsed/logger";
import {
    ErrorToAccessPagamentoServicoExternoException
} from "../../../../pagamento/core/application/exceptions/ErrorToAccessPagamentoServicoExternoException";
import {
    IPagamentoExternoServiceGateway
} from "../../../../pagamento/core/application/ports/IPagamentoExternoServiceGateway";
import { StatusPedido } from "../../../../pedido";
import { RequestPagamentoDto } from "../../../../pedido/core/dtos/RequestPagamentoDto";
import { ResponsePagamentoDto } from "../../../../pedido/core/dtos/ResponsePagamentoDto";
import { Optional } from "typescript-optional";
import { PagamentoMercadoPagoDto } from "../../../core/dto/PagamentoMercadoPagoDto";
import axios from "axios";
import { QrCodeResponseDto } from "../../../core/dto/QrCodeResponseDto";
import { QrCodeRequestDto } from "../../../core/dto/QrCodeRequestDto";

@Injectable({
    type: ProviderType.SERVICE,

    scope: ProviderScope.REQUEST,
    provide: IPagamentoExternoServiceGateway
})
export class PagamentoMockExternalServiceHttpGateway implements IPagamentoExternoServiceGateway {

    @Inject()
    private logger: Logger;

    private readonly clientServiceUrlBase: string = "https://api.mercadopago.com";

    async enviarPagamento(dto: RequestPagamentoDto): Promise<ResponsePagamentoDto> {
        try {
            this.logger.trace("Start dto={}", dto);

            this.logger.warn("### MOCK ###")
            const responsePromise = Promise.resolve(new ResponsePagamentoDto("any_payment_id"));

            this.logger.trace("End responsePromise={}", responsePromise);

            return responsePromise;

        } catch (error) {
            this.logger.error(error);
            throw new ErrorToAccessPagamentoServicoExternoException();

        }
    }

    async obterPagamento(identificadorPagamento: string): Promise<Optional<PagamentoMercadoPagoDto>> {
        try {
            const config = {
                method: "get",
                maxBodyLength: Infinity,
                url: `${this.clientServiceUrlBase}/v1/payments/${identificadorPagamento}`,
                headers: {
                    'Authorization': 'Bearer TEST-8375344102018334-082012-842b3b0893d786059eed6e0694cc6acf-29575195'
                }
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

    async gerarQrCode(qrCodeDtoRequestDto: QrCodeRequestDto): Promise<Optional<QrCodeResponseDto>> {
        try {
            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${this.clientServiceUrlBase}/instore/orders/qr/seller/collectors/29575195/pos/SUC001POS001/qrs`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer TEST-8375344102018334-082012-842b3b0893d786059eed6e0694cc6acf-29575195'
                },
                data : qrCodeDtoRequestDto
            };

            this.logger.info("Try connect mercadopago. config={}", config);
            const response = await axios.request<Optional<QrCodeResponseDto>>(config);
            this.logger.info("response={}", response);
            return response.data;
        } catch (error) {
            this.logger.warn("Erro ao gerar o qrcode no Mercado Pago. identificadorPagamento={}", qrCodeDtoRequestDto.title);
            throw new ErrorToAccessPagamentoServicoExternoException();
        }
    }

    mapStatus(statusPagamento: string): StatusPedido {
        this.logger.trace("Start statusPagamento={}", statusPagamento);

        let statusPedido = StatusPedido.AGUARDANDO_CONFIRMACAO_PAGAMENTO;
        if (statusPagamento === "pago_sucesso") {
            statusPedido = StatusPedido.EM_PREPARACAO;
        }

        this.logger.trace("End statusPedido={}", statusPedido);
        return statusPedido;
    }
}