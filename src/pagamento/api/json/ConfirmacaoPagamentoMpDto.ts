export class ConfirmacaoPagamentoMpDto {
    action: string
    api_version: string
    application_id: string
    date_created: string
    id: string
    live_mode: string
    type: string
    user_id: number
    pedidoId?: number
    data: Data
}

export class Data {
    id: string
}
