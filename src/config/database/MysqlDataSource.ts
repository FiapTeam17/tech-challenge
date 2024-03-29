import { registerProvider } from "@tsed/di";
import { DataSource } from "typeorm";
import { Logger } from "@tsed/logger";
import { ClienteModel, ProdutoModel } from "@gerencial/gateways";
import { PedidoItemModel, PedidoModel } from "@pedido/gateways";
import { PagamentoModel } from "@pagamento/gateways";

export const MYSQL_DATA_SOURCE = Symbol.for("MySqlDataSource");
const db_port: number | undefined = parseInt(process.env.DB_PORT || "3306");
export const MysqlDataSource = new DataSource({
  // name: "default",  if you come from v0.2.x
  type: "mysql",
  entities: [ProdutoModel, ClienteModel, PedidoModel, PedidoItemModel, PagamentoModel], // add this to discover typeorm model
  host: process.env.DB_HOST || "localhost", // Usar esse host para conectar as aplicação em container ao banco em container
  port: db_port,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "senha",
  database: process.env.DB_SCHEMA || "sgr_database",
  synchronize: true
});

registerProvider<DataSource>({
  provide: MYSQL_DATA_SOURCE,
  type: "typeorm:datasource",
  deps: [Logger],
  async useAsyncFactory(logger: Logger) {
    await MysqlDataSource.initialize();

    logger.info("Connected with typeorm to database: MySQL");

    return MysqlDataSource;
  },
  hooks: {
    $onDestroy(dataSource) {
      return dataSource.isInitialized && dataSource.destroy();
    }
  }
});
