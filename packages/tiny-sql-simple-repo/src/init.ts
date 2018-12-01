import { Connection } from "tedious";
import Exec from "@australis/tiny-sql-exec-sql";
import { debugModule } from "@australis/create-debug";
import exists from "@australis/tiny-sql-extra/lib/table-exists";

const debug = debugModule(module);
/**
 *
 * @param tableName {string}
 * @param tableCreationScript {string} @description Must create default fields from BasicTable
 */
export default (tableName: string, scripts: string | string[]) => () => async (
  connection: Connection,
): Promise<boolean> => {
  try {
    if (Array.isArray(scripts)) {
      for (const script of scripts) {
        await Exec(script)(connection);
      }
      return;
    }
    // ...
    if (!(await exists(tableName)(connection))) {
      await Exec(scripts)(connection);
    }
    // TODO: remove it
    return Exec<{ ok: number }>(
      `select ok=1 from sys.tables where name = '${tableName}'`,
    )(connection).then(x => x.values[0]["ok"] === 1);
  } catch (error) {
    debug(error);
    return Promise.reject(error);
  }
};
