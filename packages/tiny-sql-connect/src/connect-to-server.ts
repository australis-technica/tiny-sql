import { ConnectionConfig, ConnectionOptions } from "tedious";
/**
 * connect to server, not db
 */
export default (config: ConnectionConfig): ConnectionConfig => {
  const { options, ...engineConfig } = config;
  const { database, ...o } = (options || {}) as ConnectionOptions;
  return { ...engineConfig, options: o };
};
