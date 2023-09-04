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

## Para executar o projeto em Kubernetes (utilizando o minikube):

```
# Obs: é necessário ter o minikube instalado

# comando para buildar a imagem:
docker build -t sgr-api .

# comando para iniciar o minikube utilizando os drivers do docker:
minikube start --driver=docker

# comando para habilitar o controller nginx:
minikube addons enable ingress

# comando para carregar a imagem local para o minikube
minikube image load sgr-api
```

### Execute o configMap:
```
  kubectl apply -f deployment/k8s/sgr-configmap.yaml
```
### Execute os pods do banco de dados:
```
  kubectl apply -f deployment/k8s/mysql-config-depl.yaml
```
> [!WARNING]  
> Antes de executar os pods da API, verifique se a instância do banco está pronta:
```
  # comando para consultar os pods:
    kubectl get pod
  # copie o nome do pod e execute o comando:
    kubectl logs <pod>
  # comando para verificar o status do pod:
    kubectl get pod --watch
```
### Execute os pods da api:
```
  kubectl apply -f deployment/k8s/sgr-service-depl.yaml
```
### Execute o controller ingress:
```
  kubectl apply -f deployment/k8s/sgr-ingress
```
> [!IMPORTANT]  
> Aguarde o IP ser atribuído ao ingress antes de executar os próximos passos
```
  kubectl get ingress --watch
```
### Caso a execução esteja sendo feita em Windows, utilizando WSL e Docker Desktop, executar o seguinte comando para tunelar o controller do cluster:

```
# minikube tunnel
```

### Caso a execução esteja sendo feita em Linux, é necessário atualizar os hosts disponíveis
#### Utilize o comando a seguir para obter o IP atribuído ao ingress:
```
# kubectl get ingress
```

Adicione o IP atribuído no arquivo de hosts localizado em /etc/hosts, que deverá ficar:  
```
<IP atribuido>  sgr-api.com
```

## Após a subida dos containers siga os passos a seguir :

> Para acessar o swagger da aplicação: <a href="http://localhost:8083/doc">Clique aqui</a>  
> Para acessar o swagger da aplicação em kubernetes (Linux): <a href="sgr-api.com/doc">Clique aqui</a>  
> Para acessar o swagger da aplicação em kubernetes (WSL): <a href="http://127.0.0.1/doc/">Clique aqui</a>

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
        POST /pedido/pedidos/andamento

    # Atualizar status do pedido
        PATCH /pedido/pedidos/{id}/status

    # Integração com Mercado Pago
        A integração está na classe PagamentoMpServiceHttpGateway, como não foi realizar a integração, por falta de endpoint externo a implementação está nessa classe (chamadas das apis)
