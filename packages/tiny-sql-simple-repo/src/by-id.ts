import { Connection } from "tedious";
import execSql from "@australis/tiny-sql-exec-sql";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/** */
export default <T>(tableName: string) =>
    (id: string | number) =>
        async (connection: Connection): Promise<T> => {
            try {

                const result = await execSql(connection)<T>(
                    `select top 1 * from ${tableName} where id = @id`,
                    { id }
                );
                return Promise.resolve(result.values[0]);
            } catch (error) {
                debug(error);
                throw error;
            }
        }
