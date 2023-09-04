import { BodyParams, Logger } from "@tsed/common";
import { Post, Returns } from "@tsed/schema";
import { Controller } from "@tsed/di";
import { ConfirmacaoPagamentoDto, ConfirmacaoPagamentoMpDto } from "@pagamento/api/json";
import { MysqlDataSource } from "@database";
import { PagamentoController } from "@pagamento/controllers";
import { ErrorToAccessPagamentoServicoExternoException } from "@pagamento/usecases/exceptions";

@Controller("")
export class PagamentoApi {

    private pagamentoController: PagamentoController;
    constructor(
        private logger: Logger) {
        this.pagamentoController = new PagamentoController(MysqlDataSource, logger);
    }

    @Post("/pagamentos/confirmar")
    @Returns(200)
    async confirmar(@BodyParams() confirmacaoPagamentoJson: ConfirmacaoPagamentoDto): Promise<void> {
        this.logger.info("Start confirmacaoPagamentoJson={}", confirmacaoPagamentoJson);

        //fixme: Esta chamada deve ser async
        await this.pagamentoController.confirmar(confirmacaoPagamentoJson.identificador, confirmacaoPagamentoJson.status);
        this.logger.trace("End");
    }

    @Post("/pagamentos/confirmarMercadoPago")
    @Returns(200)
    async confirmarMercadoPago(@BodyParams() confirmacaoPagamentoMpJson: ConfirmacaoPagamentoMpDto): Promise<void> {
        await this.pagamentoController.confirmarPagamentoMercadoPago(confirmacaoPagamentoMpJson.data.id);
    }

    @Post("/pagamentos/confirmarMockMercadoPago")
    @Returns(200)
    async confirmarMockMercadoPago(@BodyParams() confirmacaoPagamentoMpJson: ConfirmacaoPagamentoMpDto): Promise<void> {
        if (confirmacaoPagamentoMpJson.pedidoId === undefined) {
            this.logger.warn("Pedido esta vazio. pedidoId={}", confirmacaoPagamentoMpJson.pedidoId);
            throw new ErrorToAccessPagamentoServicoExternoException();
        }
        await this.pagamentoController.confirmarPagamentoMockMercadoPago(confirmacaoPagamentoMpJson.pedidoId as number);

    }
}