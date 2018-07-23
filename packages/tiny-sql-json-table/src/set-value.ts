import ExecSql from "@australis/tiny-sql-exec-sql";
import { Connection } from "tedious";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/** */
export default function setValue(tableName: string) {
    /** */
    return async (connection: Connection, key: string, value: any)=> {
        try {
            const execSql = ExecSql(connection);
            await execSql(`
                update ${tableName} 
                    set [value] = @value
                    WHERE [key] = '${key}';`,
                    { value: JSON.stringify(value)}
                );
            return Promise.resolve();
        } catch (error) {
            debug(error);
            return Promise.reject(error)
        }
    }
}