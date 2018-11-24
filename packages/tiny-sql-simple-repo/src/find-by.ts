import { Connection } from "tedious";
import Exec from "@australis/tiny-sql-exec-sql";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/**
 *
 */
export default <T>(tableName: string) => (params: Partial<T>) => async (
  connection: Connection,
): Promise<T[]> => {
  try {
    const query = `/*find-by*/
select * from ${tableName} 
  where ${Object.keys(params)
    .map(key => ` ${key} = @${key}`)
    .join(" AND ")};
/*find-by*/`;
    debug(query);
    const r = await Exec<T>(query, params)(connection);    
    return Promise.resolve(r.values);
  } catch (error) {
    debug(error);
    return Promise.reject(error);
  }
};
