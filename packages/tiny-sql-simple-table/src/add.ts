import { Connection } from "tedious";
import ExecSql from "@australis/tiny-sql-exec-sql";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/**
 * 
 */
export default function Add<T>(TABLE_NAME: string, byId: (connection: Connection, id: string | number) => Promise<T>) {
    /**
     * 
     */
    return async function add(
        connection: Connection,
        item: Partial<T> & { id: string; displayName: string }
    ): Promise<T> {
        try {
            const sql = `
        insert into ${TABLE_NAME}         
        (${Object.keys(item)
                    // .filter(key => key !== "id")
                    .join(",")}) 
        values 
        (${Object.keys(item)
                    // .filter(key => key !== "id")
                    .map(key => `@${key}`)
                    .join(",")}) 
        `;
            await ExecSql<T>(sql, item)(connection);
            return byId(connection, item.id);
        } catch (error) {
            debug(error);
            throw error;
        }
    }
}