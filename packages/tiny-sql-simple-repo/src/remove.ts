import { debugModule } from "@australis/create-debug";
import { Exec } from "@australis/tiny-sql-exec-sql";
import { Connection } from "tedious";
const debug = debugModule(module);
/** */
export default (tableName: string) => (id: string | number) => async (
  connection: Connection,
) => {
  try {
    const r = await Exec(`DELETE ${tableName} where id = @id`, { id })(connection);
    if (r.error) return Promise.reject(r.error);
    return Promise.resolve(r);
  } catch (error) {
    debug(error);
    return Promise.reject(error);
  }
};
