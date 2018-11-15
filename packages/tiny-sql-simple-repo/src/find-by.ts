import { Connection } from "tedious";
import ExecSql from "@australis/tiny-sql-exec-sql";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/**
 * 
 */
export default <T>(tableName: string) =>
    (params: Partial<T>) => 
    async (connection: Connection): Promise<T[]> =>
    {
            try {
                const execSql = ExecSql(connection);
                const query = `/*find-by*/
select * from ${tableName} 
  where ${Object.keys(params)
                        .map(key => ` ${key} = @${key}`)
                        .join(" AND ")};
/*find-by*/`;
                debug(query);
                const r = await execSql<T>(query, params);
                if (r.error) {
                    return Promise.reject(r.error);
                }
                return Promise.resolve(r.values);
            } catch (error) {
                debug(error);
                throw error;
            }
        }