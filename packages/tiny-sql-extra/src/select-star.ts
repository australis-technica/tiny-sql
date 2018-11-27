import execSql from "@australis/tiny-sql-exec-sql";
import { Connection } from "tedious";
/** */
export default <T>(tableName: string) => () => (connection: Connection) =>
  execSql<T>(`select * from ${tableName}`)(connection).then(x => x.values);
