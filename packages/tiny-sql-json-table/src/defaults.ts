import Exec from "@australis/tiny-sql-exec-sql";
import { debugModule } from "@australis/create-debug";
import { Connection } from "tedious";
const debug = debugModule(module);
/**
 * Insert if not exists 
 * @param tableName 
 */
export default function (tableName: string) {
  /** */
  return (values: { [key: string]: any }) => async (connection: Connection) => {
    try {

      const execs = Object.keys(values).map(key => ({
        key,
        value: JSON.stringify(values[key])
      })).map(({ key, value }) => Exec(`
      if not exists (select [key] from ${tableName} where [key] = @key )
      insert into ${tableName}
        ([key], [value])
      values 
        (@key, @value);`, { key, value }));

      for (const ex of execs) {
        await ex(connection);
      }
      return Promise.resolve();
    } catch (error) {
      debug(error);
      return Promise.reject(error);
    }
  };
}
