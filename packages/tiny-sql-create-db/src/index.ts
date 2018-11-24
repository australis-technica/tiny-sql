import execSql from "@australis/tiny-sql-exec-sql";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/**
 * create database if not exists
 */
export default async function createSqlDb(database: string) {
  return execSql(`
      if(not(exists(select name from sys.databases where name = '${database}')))
      create database ${database};
      `);
}
