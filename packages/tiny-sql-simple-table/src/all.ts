import { Connection } from "tedious";
import execSql from "@australis/tiny-sql-exec-sql";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/**
 *
 */
export default function All<T>(TABLE_NAME: string) {
  /**
   *
   */
  return async function all(connection: Connection) {
    try {
      const result = await execSql<T>(`
          select * from ${TABLE_NAME}
          `)(connection).then(x => x.values);
      return result;
    } catch (error) {
      debug(error);
      throw error;
    }
  };
  /** */
}
