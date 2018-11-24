import Exec from "@australis/tiny-sql-exec-sql";
import { Connection } from "tedious";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/** */
export default function remove(tableName: string) {
    /** */
    return (key: string) => (connection: Connection) => {
        try {

            return Exec(`delete ${tableName} where [key] = @key`, { key })(connection).then();
        } catch (error) {
            debug(error);
            return Promise.reject(error);
        }
    }
};
