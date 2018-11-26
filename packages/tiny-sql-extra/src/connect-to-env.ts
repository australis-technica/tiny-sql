import connect from "@australis/tiny-sql-connect";
import connectionConfig from "@australis/tiny-sql-connection-config";
import { Connection } from "tedious";
/** */
export default (envKey = "DB") => (): Promise<Connection> => connect(connectionConfig(envKey));