import execSql from "@australis/tiny-sql-exec-sql";
import { Connection, TYPES } from "tedious";
import { TediousParameter } from "@australis/tiny-sql-params";
/** */
export default (tableName: string) => (connection: Connection) =>
  execSql<{ exists: boolean }>(
    "select @exists=(case when (exists (select name from sys.tables where name = @tableName)) then 1 else 0 end)",
    [
      {
        tableName,
      },
      {
        name: "exists",
        type: TYPES.Bit,
        out: true,
        value: undefined,
      } as TediousParameter,
    ],
  )(connection).then(({ values }) => values[0].exists);
