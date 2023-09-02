import { BodyParams, Logger } from "@tsed/common";
import { Post, Returns } from "@tsed/schema";
import { Controller } from "@tsed/di";
import { ConfirmacaoPagamentoJson, ConfirmacaoPagamentoMpJson } from "@pagamento/api/json";
import { PagamentoController } from "@pagamento/controllers/PagamentoController";
import { MysqlDataSource } from "@database";
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
    async confirmar(@BodyParams() confirmacaoPagamentoJson: ConfirmacaoPagamentoJson): Promise<void> {
        this.logger.info("Start confirmacaoPagamentoJson={}", confirmacaoPagamentoJson);

        //fixme: Esta chamada deve ser async
        await this.pagamentoController.confirmar(confirmacaoPagamentoJson.identificador, confirmacaoPagamentoJson.status);
        this.logger.trace("End");
    }

    @Post("/pagamentos/confirmarMercadoPago")
    @Returns(200)
    async confirmarMercadoPago(@BodyParams() confirmacaoPagamentoMpJson: ConfirmacaoPagamentoMpJson): Promise<void> {
        this.logger.info("Start confirmacaoPagamentoJson={}", confirmacaoPagamentoMpJson);
        //fixme: Esta chamada deve ser async
        await this.pagamentoController.confirmarPagamentoMercadoPago(confirmacaoPagamentoMpJson.data.id);
        this.logger.trace("End");
    }

    @Post("/pagamentos/confirmarMockMercadoPago")
    @Returns(200)
    async confirmarMockMercadoPago(@BodyParams() confirmacaoPagamentoMpJson: ConfirmacaoPagamentoMpJson): Promise<void> {
        this.logger.info("Start confirmacaoPagamentoJson={}", confirmacaoPagamentoMpJson);
        if (confirmacaoPagamentoMpJson.pedidoId === undefined) {
            this.logger.warn("Pedido esta vazio. pedidoId={}", confirmacaoPagamentoMpJson.pedidoId);
            throw new ErrorToAccessPagamentoServicoExternoException();
        }
        await this.pagamentoController.confirmarPagamentoMockMercadoPago(confirmacaoPagamentoMpJson.pedidoId as number);
        this.logger.trace("End");
    }
}