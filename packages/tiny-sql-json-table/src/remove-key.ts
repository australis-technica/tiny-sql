import ExecSql from "@australis/tiny-sql-exec-sql";
import { Connection } from "tedious";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/** */
export default function removeKey(tableName: string) {
    /** */
    return async (connection: Connection, key: string): Promise<void> => {
        try {
            const execSql = ExecSql(connection);
            await execSql(`delete ${tableName} where [key] = @key`, { key });
            return Promise.resolve();
        } catch (error) {
            debug(error);
            return Promise.reject(error);
        }
    }
};
