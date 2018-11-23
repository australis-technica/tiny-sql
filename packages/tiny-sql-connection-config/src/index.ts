import { ConnectionConfig } from "tedious";
import parseString from "@australis/tiny-sql-connection-string-parse";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/** */
const _cached: { [envKey: string]: ConnectionConfig } = {};
/** */
export default function sqlConnectionConfig(envKey = "DB") {
  if (_cached[envKey]) return _cached[envKey];
  // ...
  const connectionString = process.env[envKey];
  if (!connectionString) {
    throw new Error(`process.env.${envKey} is NOT set!`);
  }
  // ...
  _cached[envKey] = parseString(connectionString);
  debug("Using %s/%s", _cached[envKey].server, _cached[envKey].options.database);
  return _cached[envKey];
};
