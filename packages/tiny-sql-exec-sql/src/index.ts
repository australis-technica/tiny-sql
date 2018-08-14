import {
  Connection,
  Request,
  ColumnValue,
  ColumnMetaData,
  TYPES
} from "tedious";
import { TediousParameter, getParams } from "@australis/tiny-sql-params";
import * as createDebug from "debug";
// ...  
const debug = createDebug("tiny-sql-exec-sql:");
/** */
export type Result<T extends {} & { [key: string]: any }> = {
  connection: Connection;
  values?: T[];
  status?: any;
  affected: any[];
  error?: Error;
};
export type ExecParams = TediousParameter[] | ({}[]) | {};
/**
 *
 */
export default function execSql(connection: Connection) {
  /** */
  return async <T>(sqlTxt: string, args?: ExecParams) =>
    new Promise<Result<T>>(async (resolve, reject) => {
      debug("query: \n" + sqlTxt);
      const values: T[] = [];
      let status: any = null;
      const affected: any[] = [];

      const request = new Request(sqlTxt, (error, rowCount, rows) => {
        if (error) {
          return reject(error);
        }
        debug(":request:row-count " + rowCount);
        debug(":request:rows \n" + JSON.stringify(rows));
        debug(":request: closing...");
        request.removeAllListeners();
        debug(":request: resolving...");
        resolve({ values, status, affected, error, connection });
      });

      request.on("row", (columns: ColumnValue[]) => {
        const row: any = {};
        columns.forEach((column, index) => {
          row[column.metadata.colName] = column.value;
          debug(
            "row:columns:" +
            index +
            "\n" +
            JSON.stringify(column.metadata.colName)
          );
        });
        values.push(row);
      });

      request.on(
        "doneProc",
        (_rowCount: number, _more: boolean, returnStatus: any) => {
          status = returnStatus;
        }
      );

      request.on("done", (rowCount: number, _more: any) => {
        debug(":doneInProc:rows: " + rowCount);
        debug(":doneInProc:more: " + _more);
        if (rowCount != null) affected.push(rowCount);
      });

      request.on("doneInProc", (rowCount: number, _more: any) => {
        debug(":doneInProc:rows: " + rowCount);
        debug(":doneInProc:more: " + _more);
        if (rowCount != null) affected.push(rowCount);
      });

      request.on(
        "returnValue",
        (parameterName: string, value: any, _metadata: ColumnMetaData) => {
          const o: any = {};
          o[parameterName] = value === TYPES.Null ? null : value;
          values.push(o);
        }
      );
      const params = getParams(args);
      if (params && params.length) {
        for (const p of params) {
          const { name, type, value, options } = p;
          request.addParameter(name, type, value, options);
        }
      }
      // execSql:
      connection.execSql(request);
    });

}