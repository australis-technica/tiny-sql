import { Connection } from "tedious";
import ExecSql from "@australis/tiny-sql-exec-sql";
import { debugModule } from "@australis/create-debug";
import byid from "./by-id";
import { BasicTable } from "./types";
const debug = debugModule(module);
/**
 * 
 */
export default function Add<T extends BasicTable>(tableName: string) {
    /** */
    return (
        item: Partial<T>
    ) => async (connection: Connection): Promise<T> => {
        try {
            const sql = `
        insert into ${tableName}         
        (${Object.keys(item)
                    // .filter(key => key !== "id")
                    .join(",")}) 
        values 
        (${Object.keys(item)
                    // .filter(key => key !== "id")
                    .map(key => `@${key}`)
                    .join(",")}) 
        `;
            debug(sql);
            await ExecSql(connection)<T>(sql, item);
            return byid<T>(tableName)(item.id)(connection);
        } catch (error) {
            debug(error);
            throw error;
        }
    }
}