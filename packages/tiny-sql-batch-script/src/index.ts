import ExecSql, { Result }  from "@australis/tiny-sql-exec-sql";
import Scripts from "@australis/tiny-sql-scripts";
import { Connection } from "tedious";
import { debugModule } from "@australis/create-debug";
const debug  = debugModule(module);
/** */
export interface DefaultOptions {
    bail?: boolean,
    scriptsHome?: string,
}
/** */
export const defaultOptions: DefaultOptions = {
    bail: false,
    scriptsHome: undefined
}
/**
 * Init script
 */
export default async function runBatchScript(connection: Connection, scriptName: string, options?: DefaultOptions) {
    const { bail, scriptsHome } = Object.assign(defaultOptions, options);
    try {
        const scripts = Scripts(scriptsHome);
        const execSql = ExecSql(connection);
        const batches = scripts.getScriptPartsSync(scriptName);
        if (!batches || !batches.length) {
            return Promise.reject(new Error("Nothing found"));
        }
        const results: (Result<any> | Error)[] = [];
        for (const part of batches) {
            try {
                if (typeof part === "string" && part.trim() === "") continue;
                const result = await execSql(part);
                results.push(result);
            } catch (error) {
                if (!bail) {
                    throw error;
                }
                debug(error);
                results.push(error);
            }
        }
        return Promise.resolve(results);
    } catch (error) {
        debug(error);
        return Promise.reject(error);
    }
};