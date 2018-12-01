import { debugModule } from "@australis/create-debug";
import Exec from "@australis/tiny-sql-exec-sql";
import { Connection } from "tedious";

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
    await Exec(scripts)(connection);
  } catch (error) {
    debug(error);
    return Promise.reject(error);
  }
};
