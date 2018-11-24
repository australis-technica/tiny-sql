import { debugModule } from "@australis/create-debug";
import Exec from "@australis/tiny-sql-exec-sql";
import { Connection } from "tedious";
const debug = debugModule(module);
/** */
export default <T>(tableName: string) => () => async (connection: Connection) => {
  try {    
    const result = await Exec<T>(`select * from ${tableName}`)(connection).then(x => x.values);
    return result;
  } catch (error) {
    debug(error);
    throw error;
  }
}
