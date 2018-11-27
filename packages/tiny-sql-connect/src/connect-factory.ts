import { Connection, ConnectionConfig } from "tedious";
import toPromise from "./to-promise";
/**
 * Create connection factory, always *new*
 */
export default (args: ConnectionConfig) =>  () => toPromise(new Connection(args))