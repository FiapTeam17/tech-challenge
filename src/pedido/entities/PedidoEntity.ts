import { PedidoDto } from "@pedido/dtos";
import { StatusPedido } from "@pedido/entities/StatusPedido";
import { PedidoItemEntity } from "@pedido/entities/PedidoItemEntity";
import { ClienteEntity, ProdutoEntity } from "@gerencial/entities";
import { AlteracaoStatusPedidoException } from "@gerencial/usecases";

export class PedidoEntity {
    get dataCadastro(): Date | undefined {
        return this._dataCadastro;
    }

    set dataCadastro(value: Date) {
        this._dataCadastro = value;
    }

    get dataConclusao(): Date | undefined {
        return this._dataConclusao;
    }

    set dataConclusao(value: Date) {
        this._dataConclusao = value;
    }
    get valorTotal(): number {
        let valorTotal = 0;
        this.itens?.forEach(i => valorTotal += i.valorTotal);
        return valorTotal;
    }

    get id(): number | undefined {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get cliente(): ClienteEntity | undefined {
        return this._cliente;
    }

    set cliente(value: ClienteEntity) {
        this._cliente = value;
    }

    get observacao(): string | undefined {
        return this._observacao;
    }

    set observacao(value: string) {
        this._observacao = value;
    }

    get status(): StatusPedido | undefined {
        return this._status;
    }

    set status(value: StatusPedido) {
        this._status = value;
    }

    get itens(): PedidoItemEntity[] | undefined {
        return this._itens;
    }

    set itens(value: PedidoItemEntity[] | undefined) {
        this._itens = value;
    }

    // get pagamentos(): Pagamento[] | undefined {
    //     return this._pagamentos;
    // }
    //
    // set pagamentos(value: Pagamento[]) {
    //     this._pagamentos = value;
    // }

    constructor(
        private _id?: number,
        private _cliente?: ClienteEntity,
        private _observacao?: string,
        private _status?: StatusPedido,
        private _dataCadastro?: Date,
        private _dataConclusao?: Date,
        private _itens?: PedidoItemEntity[],
        // private _pagamentos?: Pagamento[],
    ) {
    }

    static getInstancia(id: number, status: StatusPedido): PedidoEntity {
        const pedido = new PedidoEntity();
        pedido._id = id;
        pedido._status = status;
        return pedido;
    }

    setStatus(newStatus: StatusPedido) {
        switch (newStatus) {
            case StatusPedido.AGUARDANDO_CONFIRMACAO_PAGAMENTO:
                if (this._status === undefined || this._status === StatusPedido.AGUARDANDO_CONFIRMACAO_PAGAMENTO) {
                    this._status = newStatus;
                    return;
                }
                throw new AlteracaoStatusPedidoException("O status do pedido não permite essa alteração");

            case StatusPedido.RECEBIDO:
                if (this._status === StatusPedido.AGUARDANDO_CONFIRMACAO_PAGAMENTO) {
                    this._status = newStatus;
                    break;
                }
                throw new AlteracaoStatusPedidoException("O status do pedido não permite essa alteração");

            case StatusPedido.EM_PREPARACAO:
                if (this._status === StatusPedido.RECEBIDO) {
                    this._status = newStatus;
                    break;
                }
                throw new AlteracaoStatusPedidoException("O status do pedido não permite essa alteração");

            case StatusPedido.PRONTO:
                if (this._status === StatusPedido.EM_PREPARACAO) {
                    this._status = newStatus;
                    this._dataConclusao = new Date(Date.now());
                    break;
                }
                throw new AlteracaoStatusPedidoException("O status do pedido não permite essa alteração");

            case StatusPedido.FINALIZADO:
                if (this._status === StatusPedido.PRONTO) {
                    this._status = newStatus;
                    break;
                }
                throw new AlteracaoStatusPedidoException("O status do pedido não permite essa alteração");
        }
    }

    public getStatus(): StatusPedido {
        if (this._status === undefined) {
            this._status = StatusPedido.RECEBIDO;
        }
        return this._status;
    }

    public tempoEspera(): number {
        let dataFim: number = Date.now();
        if (this._dataConclusao) {
            dataFim = this._dataConclusao.getTime();
        }
        return dataFim - (this._dataCadastro !== undefined ? this._dataCadastro?.getTime() : Date.now());
    }

    removerCliente() {
        this._cliente = undefined;
    }

    public toPedidoDto(): PedidoDto {

        const itens = this.itens?.map(i => i.toPeditoItemDto()) || [];

        return new PedidoDto(
            this.status as never,
            this.dataCadastro as never,
            itens,
            this.observacao,
            this.cliente?.toClienteDto(),
            this.dataConclusao,
            this.id
        );
    }

    static getInstance(pedidoDto: PedidoDto): PedidoEntity {

        let cliente = undefined;
        if (pedidoDto.cliente) {
            cliente = new ClienteEntity(pedidoDto.cliente.id);
        }

        const pedido = new PedidoEntity(
            pedidoDto.id,
            cliente,
            pedidoDto.observacao,
            pedidoDto.status,
            pedidoDto.dataCadastro,
            pedidoDto.dataConclusao
        );

        pedido.itens = pedidoDto.itens?.map(i => {
            return new PedidoItemEntity(
                i.id,
                pedido,
                new ProdutoEntity(i.produto.id),
                i.quantidade,
                i.valorUnitario
            );
        });

        return pedido;
    }
}