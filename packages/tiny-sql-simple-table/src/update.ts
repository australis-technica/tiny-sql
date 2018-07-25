import { Connection } from "tedious";
import ExecSql from "@australis/tiny-sql-exec-sql";
import { debugModule } from "@australis/create-debug";
import { combineFilters, excludeKeys, filterKeys, getFields, notNullField} from "@australis/tiny-sql-params";
import { BasicTable } from "./types";

const debug = debugModule(module);

export default function Update<T extends Partial<BasicTable> & { id: string | number }>(TABLE_NAME: string) {
    //
    type TK = keyof T & string;
    /**
     * 
     */
    return async function update(
        connection: Connection,
        item: Partial<T> & { id: string }
    ): Promise<T> {
        if (!item)
            return Promise.reject(
                new Error(`@param ${TABLE_NAME}: ${TABLE_NAME} required`)
            );
        try {
            const execSql = ExecSql(connection);
            /** */
            const current = await execSql<T>(
                `select top 1 * from ${TABLE_NAME} where id = @id`,
                { id: item.id }
            ).then(x => x.values[0]);
            if (!current || !current.id) {
                return Promise.reject(new Error(`${TABLE_NAME} Not Found`));
            }
            //
            const fields = getFields(item, notNullField);
            if (!fields || !fields.length) {
                return Promise.reject(`Nothing to update`);
            }
            const exclude = excludeKeys<T, TK>("createdAt");
            /**
             * remove null, undefined & forbidden fields
             *  */            
            const params = Object.assign(
                filterKeys(current, combineFilters<T, TK>(notNullField, exclude)),
                item
            );
            const r = await execSql<T>(
                `
                update ${TABLE_NAME} 
                set 
                    ${fields}
                , updatedAt = GETDATE()
                where id = @id
            `,
                params
            );
            if (r.error) {
                return Promise.reject(r.error);
            }
            // if(r.affected === ) { return Promise.reject(r.error); }
            // if(r.status === ) { return Promise.reject(r.error); }
            const { id } = item;
            const result = await execSql<T>(`select top 1 * from ${TABLE_NAME} where id = @id`, { id });
            return Promise.resolve(result.values[0]);
        } catch (error) {
            debug(error);
            return Promise.reject(error);
        }
    }
}