import ExecSql from "@australis/tiny-sql-exec-sql";
import { Connection } from "tedious";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);

export default function (tableName: string /** */) {
  return (connection: Connection) => {
    const execSql = ExecSql(connection);
    try {
      return execSql(`
      if(NOT(exists(select * from sys.tables where name = '${tableName}')))
        exec  sp_executesql  N'create table ${tableName} (
	        [key] VARCHAR(1024) NOT NULL UNIQUE,
          [value] VARCHAR(max) NOT NULL)';
      `);
    } catch (error) {
      debug(error);
      return Promise.reject(error);
    }
  };
}
