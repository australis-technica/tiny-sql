import Exec from "@australis/tiny-sql-exec-sql";
/** */
export default (tableName: string) => (key: string) =>  Exec(`delete [${tableName}] where [key] = @key`, { key });
