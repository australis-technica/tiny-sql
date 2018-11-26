import { Connection, ConnectionConfig } from "tedious";
import isConnection from "./is-connection";
import toPromise from "./to-promise";
/**
 * Connect to config
 */
const connect = (args: ConnectionConfig | Connection) => toPromise(isConnection(args) ? args : new Connection(args));
export default connect;

