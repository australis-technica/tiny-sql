import { Connection } from "tedious";
import ExecSql from "@australis/tiny-sql-exec-sql";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/** */
export default function Remove(TABLE_NAME: string){
    /**
     * 
     */
    return async function remove(connection: Connection, id: string | number) {
        try {
          const r = await ExecSql(connection)(
            `DELETE ${TABLE_NAME} where id = @id`,
            { id }
          );
          if (r.error) return Promise.reject(r.error);
          return Promise.resolve(r);
        } catch (error) {
          debug(error);
          return Promise.reject(error);
        }
      }
}