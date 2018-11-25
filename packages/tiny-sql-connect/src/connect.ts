import { Connection, ConnectionConfig } from "tedious";
import factory from "./factory";
export default (args: ConnectionConfig | Connection) => factory(args)();