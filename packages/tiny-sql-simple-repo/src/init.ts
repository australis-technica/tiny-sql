import { Connection } from "tedious";
import Exec from "@australis/tiny-sql-exec-sql";
import { debugModule } from "@australis/create-debug";
import exists from "./exists";

const debug = debugModule(module);
/**
 *
 * @param tableName {string}
 * @param tableCreationScript {string} @description Must create default fields from BasicTable
 */
export default (tableName: string, tableCreationScript: string) => () => async (
  connection: Connection,
): Promise<boolean> => {
  try {
    // ...
    if (!(await exists(tableName)(/*args*/)(connection))) {
      await Exec(tableCreationScript)(connection);
    }
    return Exec<{ ok: number }>(
      `select ok=1 from sys.tables where name = '${tableName}'`,
    )(connection).then(x => x.values[0]["ok"] === 1);
  } catch (error) {
    debug(error);
    return Promise.reject(error);
  }
};
