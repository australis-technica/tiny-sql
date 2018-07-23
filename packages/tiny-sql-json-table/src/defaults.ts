import execSql from "@australis/tiny-sql-exec-sql";
import { Connection } from "tedious";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);

export default function(tableName: string) {
  /** */
  return async (connection: Connection, values: { [key: string]: any }) => {
    try {
      const keyValues = Object.keys(values).map(key => ({
        key,
        value: JSON.stringify(values[key])
      }));
      for (const keyValue of keyValues) {
        const { key, value } = keyValue;
        await execSql(connection)(`
        if not exists (select [key] from ${tableName} where [key] = '${key}' )
        insert into ${tableName}
          ([key], [value])
        values 
          ('${key}', '${value}');
        `);
      }
      return Promise.resolve();
    } catch (error) {
      debug(error);
      return Promise.reject(error);
    }
  };
}
