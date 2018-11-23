import { Exec } from "@australis/tiny-sql-exec-sql";

export default function (tableName: string /** */) {
  return Exec(`
  if(NOT(exists(select * from sys.tables where name = '${tableName}')))
    exec  sp_executesql  N'create table [${tableName}] (
      [key] VARCHAR(1024) NOT NULL UNIQUE,
      [value] VARCHAR(max) NOT NULL)';
  `);
}
