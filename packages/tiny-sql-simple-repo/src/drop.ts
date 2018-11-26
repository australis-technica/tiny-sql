import ExecSql from "@australis/tiny-sql-exec-sql";
export default (tableName: string) =>
  ExecSql(
    `
if(exists(select name from sys.tables where name = @tableName)) drop table [${tableName}];
`,
    { tableName },
  );
