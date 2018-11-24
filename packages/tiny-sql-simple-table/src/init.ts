import { Connection } from "tedious";
import ExecSql from "@australis/tiny-sql-exec-sql";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/**
 *
 * @param TABLE_NAME
 */
export default function Init(
  TABLE_NAME: string,
  dto: string,
  exists: (connection: Connection) => Promise<boolean>,
) {
  /**
   *
   */
  return async function init(connection: Connection): Promise<boolean> {
    try {
      // ...
      if (!(await exists(connection))) {
        await ExecSql(dto)(connection);
      }
      return ExecSql<{ ok: number }>(
        `select ok=1 from sys.tables where name = '${TABLE_NAME}'`,
      )(connection).then(x => x.values[0]["ok"] === 1);
    } catch (error) {
      debug(error);
      throw error;
    }
  };
}
