import { ClienteRetornoDto } from "@gerencial/dtos";
import { ClienteValidacaoException } from "@gerencial/usecases";

export class ClienteEntity {
    constructor(
      readonly id?: number,
        readonly nome?: string,
        readonly cpf?: string,
        readonly email?: string
    ) { }
    set(clienteAlt: ClienteEntity) {
        return new ClienteEntity(this.id, clienteAlt.nome, this.cpf, clienteAlt.email);
    }

    validar() {
        if (!this.cpf) {
            throw new ClienteValidacaoException("CPF é obrigatório");
        }
    }

    toClienteDto(): ClienteRetornoDto{
        return new ClienteRetornoDto(
          this.nome,
          this.cpf,
          this.email,
          this.id,
        );
    }
}