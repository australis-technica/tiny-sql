import { Exec } from "@australis/tiny-sql-exec-sql";
import { Connection } from "tedious";
import { KeyValue } from "./types";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/** */
const get = (tableName: string) =>
  (key: string)=>
    async (connection: Connection) => {
      try {
        return Exec<KeyValue>(`select top 1 [key], [value] from ${tableName} where [key] = @key`, { key })(connection)
          .then(({ values }) => values && values[0] && JSON.parse(values[0].value || undefined ))
      } catch (error) {
        debug(error);
        return Promise.reject(error);
      }
    };
/** */
export default get;
