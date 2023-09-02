## Como iniciar

> Projeto desenvolvido em NodeJs utilizando o framework Ts.ED e banco de dados Mysql

> Para executar o projeto siga os passos a seguir:

## Para executar o projeto siga os passos a seguir:

```
# comando para construir ou reconstruir serviços
docker-compose build

# comando para criar e iniciar os containers(aplicação e banco de dados). O comando -d executa os containers em segundo plano
docker-compose up -d

# Obs: é necessário ter o docker e docker-compose previamente instalado
```

## Após a subida dos containers siga os passos a seguir :

> Para acessar o swagger da aplicação: <a href="http://localhost:8083/doc">Clique aqui</a>

## Para criar um pedido deve-se usar a API

POST /pedido/pedidos

## Para obter o retorno do webhook deve-se usar a API de Mock

POST /pagamentos/confirmarMockMercadoPago

#Passando no body o pedidoId, que é o id do pedido obtido na api de criar pedido

Body:
{
"action": "test.created",
"api_version": "v1",
"application_id": "8375344102018334",
"date_created": "2021-01-01 02:02:02 +0000 UTC",
"id": "123456",
"live_mode": "false",
"type": "test",
"user_id": 29575195,
"pedidoId": 8,
"data": {
"id": "123456789"
}
}

## APIs solicitadas no Tech Challenge

    # Checkout do Pedido


    # Consulta Status de pagamento
        GET pedido/pedidos/consultaPagamentos/{idPedido}

    # Webhook para receber confirmação do pagamento
        POST /pagamentos/confirmarMockMercadoPago

    # Lista de Pedidos

    # Atualizar status do pedido
        PATCH /pedido/pedidos/{id}/status

    # Integração com Mercado Pago
        A integração está na classe PagamentoMpServiceHttpGateway, como não foi realizar a integração, por falta de endpoint externo a implementação está nessa classe (chamadas das apis)
