export class QrCodeRequestDto {
    external_reference: number
    title: string
    notification_url: string
    total_amount: number
    items: Item[]
    sponsor: Sponsor
    cash_out: CashOut
}

export class Item {
    sku_number: string
    category: string
    title: string
    description: string
    unit_price: number
    quantity: number
    unit_measure: string
    total_amount: number
}

export class Sponsor {
    id: number
}

export class CashOut {}
