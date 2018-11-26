import execSql from "@australis/tiny-sql-exec-sql";
/** */
export default (tableName: string)=> execSql(
    `if(exists(select 1 from sys.tables where name = '${tableName}')) drop table [${tableName}]`
  )