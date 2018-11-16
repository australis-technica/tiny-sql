import { debugModule } from "@australis/create-debug";
import { Exec } from "@australis/tiny-sql-exec-sql";
import { Connection } from "tedious";
const debug = debugModule(module);
/**
 *
 * @param TABLE_NAME
 */
export default (tableName: string) => () => (
  connection: Connection,
): Promise<boolean> => {
  const query = `
    select [exists]=CAST( case when exists(select top 1 name from sys.tables where name = @name) then 1 else 0 end as BIT) 
    `;
  debug(query);
  return Exec<{ exists: boolean }>(query, { name: tableName })(connection).then(
    x => !!x.values[0].exists,
  );
};
