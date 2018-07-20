import { ConnectionConfig } from "tedious";
import { isString } from "util";
import { debugModule } from "@australis/create-debug";
const debug  = debugModule(module);
/** 
 * sample 'Data Source=(local);Initial Catalog=DBNAME;user=userName;password=password;'
 * */
export default function parseString(connectionString: string): ConnectionConfig {
  try {
    if (connectionString.indexOf("Integrated Security") !== -1) {
      throw new Error("Integrated Security is Not Implemented");
    }
    const config = connectionString.split(";")
      .filter(x => isString(x) && x.trim() !== "")
      .reduce((out, next) => {
        const parts = next.split("=");
        return Object.assign(out, { [parts[0]]: parts[1] });
      }, {} as { [key: string]: string });
    const server = config["Data Source"].split(":")[0].replace("(local)", "localhost");
    const port = Number(config["Data Source"].split(":")[1]) || 1433
    const database = config["Initial Catalog"];
    // non standard?
    const encrypt = Boolean(config.encrypt);
    return {
      server,
      userName: config["user"],
      password: config["password"],
      options: {
        database,
        port,
        encrypt
      }
    }
  } catch (error) {
    debug("can't parse connection-string: %s", error.message);
    return undefined;
  }
}