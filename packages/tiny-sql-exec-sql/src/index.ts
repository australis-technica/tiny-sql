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
        debug("request:callback " , error,  rowCount, rows && rows.length);                
        request.removeAllListeners();
        resolve({ values, status, affected, error, connection });
      });

      request.on("row", (columns: ColumnValue[]) => {
        const row: any = {};
        columns.forEach((column) => {
          row[column.metadata.colName] = column.value;          
        });
        values.push(row);
      });

      request.on("doneProc", (error: Error, more: boolean, rows: any[]) => {
        status = {
          error,
          more,
          rows
        };
        debug("doneProc: ", status);
      }
      );

      request.on("done", (error: Error, more: boolean, rows: any[]) => {
        status = {
          error,
          more,
          rows
        };
        debug("done: ", status);
      });

      request.on("doneInProc", (error: Error, more: boolean, returnStatus: any, rows: any[]) => {
        status = {
          error,
          more,
          rows,
          returnStatus
        };
        debug("doneInProc: ", status);
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
      if (params && params.length > 0) {
        for (const p of params) {
          const { name, type, value, options } = p;
          request.addParameter(name, type, value, options);
        }
      }
      // execSql:
      connection.execSql(request);
    });

}