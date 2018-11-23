import { Exec } from "@australis/tiny-sql-exec-sql";
import { Connection } from "tedious";
import { KeyValue } from "./types";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/** */
const find = (tableName: string, like: string) =>
    /** */
    async (connection: Connection): Promise<{ [key: string]: any }> => {
        try {
            return Exec<KeyValue>(
                `select top 1 [key], [value] from ${tableName} where [key] like '${like}'`
            )(connection).then(({ values }) => values
                .map(x => {
                    const { key, value } = x;
                    try {
                        return {
                            [key]: JSON.parse(value)
                        };
                    } catch (error) {
                        debug(error);
                        return { [key]: undefined };
                    }
                })
                .reduce(
                    (out, next) => {
                        return Object.assign(out, next);
                    },
                    {} as { [key: string]: any }
                ))
        } catch (error) {
            debug(error);
            return Promise.reject(error);
        }
    };
/** */
export default find;
