import { debugModule } from "@australis/create-debug";
import { getParams, TediousParameter } from "@australis/tiny-sql-params";
import { ColumnValue, Connection, Request, TYPES } from "tedious";
// ...
const debug = debugModule(module);

/** don't return error, it is rejected */
export type Result<T extends {} & { [key: string]: any }> = {
  values: T[];
  rowCount: number;
  rows: any[];
};
// ...
export type Params = TediousParameter[] | {};
/**
 *
 */
export default <T>(sqlTxt: string, inputParams?: Params) => {
  debug("query:\n%s,", sqlTxt, inputParams);

  return (connection: Connection) =>
    // ...
    new Promise<Result<T>>((resolve, reject) => {
      let ret: Result<T> = {
        values: [],
        rowCount: 0,
        rows: [],
      };

      const request = new Request(sqlTxt, (error, rowCount, rows) => {
        if (error) {
          return reject(error);
        }
        ret = {
          ...ret,
          rowCount,
          rows,
        };
        if (debug.enabled) {
          debug("request-callback", ret);
        }
        request.removeAllListeners();
        resolve(ret);
      });
      /** */
      request.on("row", (columns: ColumnValue[]) => {
        const row: any = {};
        columns.forEach((column, i) => {
          // if script didnt specify column name use index
          row[column.metadata.colName || i] = column.value;
        });
        ret.values.push(row);
      });
      // 
      request.on("returnValue", (parameterName, value, metadata) => {
        if (debug.enabled) {
          const { colName, type } = (metadata || {}) as any;
          const { name: typeName, id: typeId, out } = (type || {}) as any;
          debug("return-value: ", {
            parameterName,
            value,
            colName,
            typeName,
            typeId,
            out,
          });
        }
        ret.values.push({ [parameterName || metadata.colName]: value } as T);
      });
      //
      {
        // convert {} to Parameter
        const params = inputParams && getParams(inputParams);
        if (params && params.length > 0) {
          for (const p of params) {
            const { name, type, value, length, precision, scale, out } = p;
            let options = undefined;
            if (length || precision || scale) {
              options = {
                length,
                precision,
                scale,
              };
            }
            if (debug.enabled) {
              const { name: typeName, id: typeId } = (type || {}) as any;
              debug("param:", {
                name,
                typeName,
                typeId,
                out: !!out,
                value,
                options,
              });
            }
            if (out) {
              request.addOutputParameter(name, type, value, options);
            } else {
              request.addParameter(name, type, value, options);
            }
          }
        }
      }
      // execSql:
      connection.execSql(request);
    });
};
