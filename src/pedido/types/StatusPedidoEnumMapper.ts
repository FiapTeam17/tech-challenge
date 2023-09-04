import { StatusPedido } from "@pedido/entities";
import { Exception } from "@tsed/exceptions";

export class StatusPedidoEnumMapper {
  
  static numberParaEnum(codigo?: number): StatusPedido{
    switch (codigo){
      case 0:
        return StatusPedido.AGUARDANDO_CONFIRMACAO_PAGAMENTO;
      case 1:
        return StatusPedido.RECEBIDO;
      case 2:
        return StatusPedido.EM_PREPARACAO;
      case 3:
        return StatusPedido.PRONTO;
      case 4:
        return StatusPedido.FINALIZADO;
      default:
        throw new Exception(500,"Status Inválido");
    }
  }
  
  static stringParaEnum(opcao?: string): StatusPedido{
    switch (opcao){
      case "AGUARDANDO_CONFIRMACAO_PAGAMENTO":
        return StatusPedido.AGUARDANDO_CONFIRMACAO_PAGAMENTO;
      case "RECEBIDO":
        return StatusPedido.RECEBIDO;
      case "EM_PREPARACAO":
        return StatusPedido.EM_PREPARACAO;
      case "PRONTO":
        return StatusPedido.PRONTO;
      case "FINALIZADO":
        return StatusPedido.FINALIZADO;
      default:
        throw new Exception(500,"Status Inválido");
    }
  }

  static enumParaString(status? : StatusPedido): string {

    switch (status){
      case StatusPedido.AGUARDANDO_CONFIRMACAO_PAGAMENTO:
        return "AGUARDANDO_CONFIRMACAO_PAGAMENTO";
      case StatusPedido.RECEBIDO:
        return "RECEBIDO";
      case StatusPedido.EM_PREPARACAO:
        return "EM_PREPARACAO";
      case StatusPedido.PRONTO:
        return "PRONTO";
      case StatusPedido.FINALIZADO:
        return "FINALIZADO";
      default:
        throw new Exception(500,"Status Inválido");
    }
  }

  static enumParaNumber(status? : StatusPedido): number{
    switch (status){
      case StatusPedido.AGUARDANDO_CONFIRMACAO_PAGAMENTO:
        return 0;
      case StatusPedido.RECEBIDO:
        return 1;
      case StatusPedido.EM_PREPARACAO:
        return 2;
      case StatusPedido.PRONTO:
        return 3;
      case StatusPedido.FINALIZADO:
        return 4;

      default:
        throw new Exception(500,"Status Inválido");
    }
  }

  static numberParaString(codigo?: number): string {
    const enumStatus = StatusPedidoEnumMapper.numberParaEnum(codigo);
    return StatusPedidoEnumMapper.enumParaString(enumStatus);
  }

  static stringParaNumber(codigo?: string): number {
    const enumStatus = StatusPedidoEnumMapper.stringParaEnum(codigo);
    return StatusPedidoEnumMapper.enumParaNumber(enumStatus);
  }
}

