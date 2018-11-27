import execSql from "@australis/tiny-sql-exec-sql";
/** */
export default (tableName: string) => execSql(`delete ${tableName}`);