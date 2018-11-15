import { Connection } from "tedious";
import ExecSql from "@australis/tiny-sql-exec-sql";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/** */
export default (tableName: string) =>
  (id: string | number) =>
    async (connection: Connection) => {
      try {
        const r = await ExecSql(connection)(
          `DELETE ${tableName} where id = @id`,
          { id }
        );
        if (r.error) return Promise.reject(r.error);
        return Promise.resolve(r);
      } catch (error) {
        debug(error);
        return Promise.reject(error);
      }
    }