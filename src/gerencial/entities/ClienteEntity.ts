import { ClienteDto } from "@gerencial/dtos";
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

    toClienteDto(): ClienteDto{
        return new ClienteDto(
          this.id,
          this.nome,
          this.cpf,
          this.email
        );
    }
}