import { Connection } from "tedious";
import ExecSql from "@australis/tiny-sql-exec-sql";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/**
 * 
 */
export default function FindBy<T>(TABLE_NAME: string) {
    /**
     * 
     */
    return async function findBy(
        connection: Connection,
        params: Partial<T>
    ): Promise<T[]> {
        try {            
            const query = `/*find-by*/
    select * from ${TABLE_NAME} 
      where ${Object.keys(params)
                    .map(key => ` ${key} = @${key}`)
                    .join(" AND ")};
    /*find-by*/`;
            debug(query);
            const r = await ExecSql<T>(query, params)(connection);         
            return Promise.resolve(r.values);
        } catch (error) {
            debug(error);
            throw error;
        }
    }
}