import execSql from "@australis/tiny-sql-exec-sql";
/**
 * create database if not exists
 */
export default async (database: string) => {
  return execSql(`
      if(not(exists(select name from sys.databases where name = '${database}')))
      create database ${database};
      `);
};
