import ExecSql from "@australis/tiny-sql-exec-sql";
import { Connection } from "tedious";
import { KeyValue } from "./types";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/** */
const getValue = (tableName: string) =>
  /** */
  async (connection: Connection, key: string): Promise<any> => {
    try {
      const execSql = ExecSql(connection);
      const { values } = await execSql<KeyValue>(`select top 1 [key], [value] from ${tableName} where [key] - @key`, { key });
      const { value } = values[0];
      return Promise.resolve(JSON.parse(value));
    } catch (error) {
      debug(error);
      return Promise.reject(error);
    }
  };
/** */
export default getValue;
