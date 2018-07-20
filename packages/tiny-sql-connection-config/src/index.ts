import { ConnectionConfig } from "tedious";
import parseString from "@australis/tiny-sql-connection-string-parse";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/** */
let connectionConfig: ConnectionConfig;
/** */
export default function sqlConnectionConfig(envKey = "DB") {
  if (connectionConfig && connectionConfig.options.database === envKey) return connectionConfig;
  // ...
  const connectionString = process.env[envKey];
  if (!connectionString) {
    throw new Error(`process.env.${envKey} is NOT set!`);
  }
  connectionConfig = parseString(connectionString);
  debug(
    "Using %s/%s",
    connectionConfig.server,
    connectionConfig.options.database
  );
  return connectionConfig;
};
