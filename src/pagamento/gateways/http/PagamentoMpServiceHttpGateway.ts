import { IPagamentoMpServiceHttpGateway } from "@pagamento/interfaces";
import axios from "axios";
import { Logger } from "@tsed/common";
import { Optional } from "typescript-optional";
import { PagamentoMercadoPagoDto, QrCodeRequestDto, QrCodeResponseDto } from "@pagamento/dtos";
import { ErrorToAccessPagamentoServicoExternoException } from "@pagamento/usecases/exceptions";
import { StatusPedido } from "@pedido/entities";

export class PagamentoMpServiceHttpGateway implements IPagamentoMpServiceHttpGateway {

    private readonly clientServiceUrlBase: string = "https://api.mercadopago.com";//FIXME: usar arquivo properties
    private readonly token = process.env.token || "TEST-8375344102018334-082012-842b3b0893d786059eed6e0694cc6acf-29575195";

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
                headers: {
                    'Authorization': `Bearer ${this.token}`
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

    async criarQrCode(qrCodeDtoRequestDto: QrCodeRequestDto): Promise<Optional<QrCodeResponseDto>> {
        try {

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${this.clientServiceUrlBase}/instore/orders/qr/seller/collectors/29575195/pos/SUC001POS001/qrs`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
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

    private mapStatus(statusPagamento: string): StatusPedido {
        this.logger.trace("Start statusPagamento={}", statusPagamento);

        let statusPedido = StatusPedido.AGUARDANDO_CONFIRMACAO_PAGAMENTO;
        if (statusPagamento === "pago_sucesso") {
            statusPedido = StatusPedido.EM_PREPARACAO;
        }

        this.logger.trace("End statusPedido={}", statusPedido);
        return statusPedido;
    }
}