import { debugModule } from "@australis/create-debug";
import { getParams, TediousParameter } from "@australis/tiny-sql-params";
import {
  ColumnMetaData,
  ColumnValue,
  Connection,
  Request,
  TYPES,
} from "tedious";
// ...
const debug = debugModule(module);
/** */
export type Result<T extends {} & { [key: string]: any }> = {
  values?: T[];
  status?: any;
  error?: Error;
};

// ...

export type ExecParams = TediousParameter[] | ({}[]) | {};
/**
 *
 */
export default <T>(sqlTxt: string, args?: ExecParams) => (
  connection: Connection,
) =>
  new Promise<Result<T>>(async (resolve, reject) => {
    debug("query: \n" + sqlTxt);
    const values: T[] = [];
    let status: any = {};

    const request = new Request(sqlTxt, (error, rowCount, rows) => {
      if (error) {
        return reject(error);
      }
      const rowsLength = rows && rows.length;
      debug(
        "request:callback error, rowCount, rowsLength",
        error,
        rowCount,
        rowsLength,
      );
      request.removeAllListeners();
      resolve({
        values,
        status: {
          ...status,
          rowCount,
          rowsLength,
        },
        error,
      });
    });

    request.on("row", (columns: ColumnValue[]) => {
      const row: any = {};
      columns.forEach(column => {
        row[column.metadata.colName] = column.value;
      });
      values.push(row);
    });

    request.on("doneProc", (error: Error, more: boolean, rows: any[]) => {
      status = {
        ...status,
        error,
        more,
        rows,
      };
      debug("doneProc: ", status);
    });

    request.on("done", (error: Error, more: boolean, rows: any[]) => {
      status = {
        ...status,
        error,
        more,
        rows,
      };
      debug("done: ", status);
    });

    request.on(
      "doneInProc",
      (error: Error, more: boolean, returnStatus: any, rows: any[]) => {
        status = {
          ...status,
          error,
          more,
          rows,
          returnStatus,
        };
        debug("doneInProc: ", status);
      },
    );

    request.on(
      "returnValue",
      (parameterName: string, value: any, _metadata: ColumnMetaData) => {
        const o: any = {};
        o[parameterName] = value === TYPES.Null ? null : value;
        values.push(o);
      },
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
