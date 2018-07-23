import execSql from "@australis/tiny-sql-exec-sql";
import { Connection } from "tedious";
import connectToServer from "@australis/tiny-sql-connect-to-server";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/**
 * create database if not exists
 */
export default async function createSqlDb(database: string) {
  let connection: Connection;
  try {
    // do connect to database
    connection = await connectToServer();
    const r = await execSql(connection)(`
      if(not(exists(select name from sys.databases where name = '${database}')))
      create database ${database};
      `);
    return Promise.resolve(r);
  } catch (error) {
    debug(error);
    return Promise.reject(Object.assign(error, { database }));
  } finally {
    connection && connection.close;
  }
}
