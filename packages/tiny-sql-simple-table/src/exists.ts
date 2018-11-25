import { Connection } from "tedious";
import ExecSql from "@australis/tiny-sql-exec-sql";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/**
 *
 * @param tableName
 */
export default function Exists(tableName: string) {
  return async function exists(connection: Connection): Promise<boolean> {
    const query = `
        select [exists]=CAST( case when exists(select top 1 name from sys.tables where name = @name) then 1 else 0 end as BIT) 
        `;
    debug(query);
    return ExecSql<{ exists: boolean }>(query, { name: tableName })(
      connection,
    ).then(x => !!x.values[0].exists);
  };
}
