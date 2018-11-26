import Exec from "@australis/tiny-sql-exec-sql";
/** */
export default (tableName: string) => Exec(`delete ${tableName}`);