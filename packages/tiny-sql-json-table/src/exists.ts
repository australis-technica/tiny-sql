import Exec from "@australis/tiny-sql-exec-sql";
import { Connection } from "tedious";
/** */
export default (tableName: string) =>
  (key: string) => (connection: Connection) =>
    Exec<{ key: string }>(`select top 1 [key] from ${tableName} where [key] = @key;`, { key })(connection).then(({ values }) => values.length !== 0);
