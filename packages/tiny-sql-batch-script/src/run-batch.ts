import ExecSql from "@australis/tiny-sql-exec-sql";
import { Connection } from "tedious";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/** */
export interface DefaultOptions {}
/**
 * @param {string} batches scripts as 1 string
 * @param splitter optional splitter defaults to 'GO'
 */
export default (
  batches: string,
  splitter: {
    [Symbol.split](string: string, limit?: number): string[];
  } = /go/i,
  limit?: number,
) => async (connection: Connection) => {
  let parts: string[];
  try {
    parts = batches
      .split(splitter, limit)
      .filter(batch => batch && batch.trim() !== "");
    const results: any[] = [];
    for (const sql of parts) {
      results.push(await ExecSql(sql)(connection));
    }
    return results;
  } catch (error) {
    debug(error);
    return Promise.reject(error);
  }
};
