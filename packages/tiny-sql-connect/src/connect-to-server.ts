import connect from "./connect";
import { Connection, ConnectionOptions } from "tedious";
import sqlConnectionConfig from "@australis/tiny-sql-connection-config";
/**
 * connect to server, not db
 */
export default (envKey = "DB"): Promise<Connection> => {
  const { options, ...engineConfig } = sqlConnectionConfig(envKey);
  const { database, ...o } = (options|| {}) as ConnectionOptions;
  return connect({ ...engineConfig, options: o });
};
