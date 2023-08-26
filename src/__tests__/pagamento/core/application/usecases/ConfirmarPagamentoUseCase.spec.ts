import { Logger } from "@tsed/common";
import { mock } from "jest-mock-extended";
import { IPedidoServiceGateway } from "../../../../../../src/pagamento/core/application/ports/IPedidoServiceGateway";
import { IPagamentoExternoServiceGateway } from "../../../../../../src/pagamento/core/application/ports/IPagamentoExternoServiceGateway";
import { ConfirmarPagamentoUseCase } from "../../../../../../src/pagamento/core/application/usecases/ConfirmarPagamentoUseCase";
import { StatusPedido } from "../../../../../../src/pedido/core/domain/StatusPedido";
import { PedidoDto } from "../../../../../../src/pagamento/core/dto/PedidoDto";
import { Optional } from "typescript-optional";
import {
  IPagamentoMpServiceHttpGateway
} from "../../../../../pagamento/core/application/ports/IPagamentoServiceHttpGateway";
import { PagamentoMercadoPagoDto } from "../../../../../pagamento/core/dto/PagamentoMercadoPagoDto";

const mockedLogger = mock<Logger>();

describe("Testes de Confirmar Pagamento - Usecase", () => {
  // beforeEach(PlatformTest.create);
  // afterEach(PlatformTest.reset);

  
  it("deve confirmar um pagamento", async () => {
    // const identificadorPagamento = "any-aaa";
    // const statusPagamento = "any-bbb";
    //
    // const mockedPedidoServiceGateway = mock<IPedidoServiceGateway>();
    // const pedidoDto = new PedidoDto(1, "EM_PREPARACAO");//Any pedido com status igual a "AGUARDANDO_CONFIRMACAO_PAGAMENTO"
    // mockedPedidoServiceGateway.obterPorIdentificadorPagamento.calledWith(identificadorPagamento).mockResolvedValue(Optional.of(pedidoDto));
    //
    // const mockedPagamentoExternoServiceGateway = mock<IPagamentoExternoServiceGateway>();
    // mockedPagamentoExternoServiceGateway.mapStatus.calledWith(statusPagamento).mockReturnValue(StatusPedido.AGUARDANDO_CONFIRMACAO_PAGAMENTO);
    //
    // const mockedPagamentoMpServiceGateway = mock<IPagamentoMpServiceHttpGateway>();
    // const pagamentoMpDto = new PagamentoMercadoPagoDto();
    // mockedPagamentoMpServiceGateway.obterPagamento.calledWith(identificadorPagamento).mockResolvedValue(Optional.of(pagamentoMpDto));
    //
    // const usecase = new ConfirmarPagamentoUseCase(mockedLogger, mockedPedidoServiceGateway, mockedPagamentoExternoServiceGateway, mockedPagamentoMpServiceGateway);
    //
    // await usecase.confirmar(identificadorPagamento, statusPagamento);
    //
    // const pedidoDtoStatusPago = mockedPedidoServiceGateway.alterarStatus.mock.calls[0][0];
    // expect(pedidoDto.id).toEqual(pedidoDtoStatusPago.id);
    // expect(2).toEqual(pedidoDtoStatusPago.status);
  });
});
