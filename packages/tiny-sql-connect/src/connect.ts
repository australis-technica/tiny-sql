import { Connection, ConnectionConfig } from "tedious";
import factory from "./connect-factory";
export default (args: ConnectionConfig | Connection) => factory(args)();