import Exec from "@australis/tiny-sql-exec-sql";
import { Connection } from "tedious";
import { KeyValue } from "./types";

const reduce: (x: { values: KeyValue[] }) => any = ({ values }) => 
  values && values[0] && values[0].value && JSON.parse(values[0].value || undefined)
/** */
export default (tableName: string) =>
  (key: string) =>
    (connection: Connection) => Exec<KeyValue>(`select top 1 [key], [value] from [${tableName}] where [key] = @key`, { key })(connection)
      .then(reduce);
