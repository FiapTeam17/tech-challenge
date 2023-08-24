import { BodyParams, Inject, Logger } from "@tsed/common";
import { Post, Returns } from "@tsed/schema";
import { Controller } from "@tsed/di";
import { IConfirmarPagamentoUseCase, IEfetuarPagamentoUseCase } from "../../../core/application";

import { PagamentoJson } from "./json/PagamentoJson";
import { ConfirmacaoPagamentoJson } from "./json/ConfirmacaoPagamentoJson";
import { EfetuarPagamentoParamDto } from "../../../core/dto/flows/EfetuarPagamentoParamDto";
import { ConfirmacaoPagamentoMpJson } from "./json/ConfirmacaoPagamentoMpJson";

@Controller("")
export class PagamentoController {

    constructor(
        @Inject(IEfetuarPagamentoUseCase) private efetuarPagamentoUseCase: IEfetuarPagamentoUseCase,
        @Inject(IConfirmarPagamentoUseCase) private confirmarPagamentoUseCase: IConfirmarPagamentoUseCase,
        @Inject() private logger: Logger) {
    }

    @Post("/pagamentos/efetuar")
    @Returns(200)
    async efetuar(@BodyParams() pagamentoJson: PagamentoJson): Promise<string | undefined> {
        this.logger.info("Start pagamentoJson={}", pagamentoJson);
        const returnDto = await this.efetuarPagamentoUseCase.efetuar(new EfetuarPagamentoParamDto(pagamentoJson.getDto()));
        const pagamentoId = returnDto.pagamentoId;
        this.logger.trace("End pagamentoId={}", pagamentoId);
        return `${pagamentoId}`;
    }

    @Post("/pagamentos/confirmar")
    @Returns(200)
    async confirmar(@BodyParams() confirmacaoPagamentoJson: ConfirmacaoPagamentoJson): Promise<void> {
        this.logger.info("Start confirmacaoPagamentoJson={}", confirmacaoPagamentoJson);

        //fixme: Esta chamada deve ser async
        await this.confirmarPagamentoUseCase.confirmar(confirmacaoPagamentoJson.identificador, confirmacaoPagamentoJson.status);
        this.logger.trace("End");
    }

    @Post("/pagamentos/confirmarMercadoPago")
    @Returns(200)
    async confirmarMercadoPago(@BodyParams() confirmacaoPagamentoMpJson: ConfirmacaoPagamentoMpJson): Promise<void> {
        this.logger.info("Start confirmacaoPagamentoJson={}", confirmacaoPagamentoMpJson);
        //fixme: Esta chamada deve ser async
        await this.confirmarPagamentoUseCase.confirmarPagamentoMercadoPago(confirmacaoPagamentoMpJson.data.id);
        this.logger.trace("End");
    }
}