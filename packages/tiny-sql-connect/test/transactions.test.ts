import { factory as Connect, using, transaction } from "../src";
import config from "@australis/tiny-sql-connection-config";
import { Connection } from "tedious";
import execSql from "@australis/tiny-sql-exec-sql";
import { randomBytes } from "crypto";

const connect = Connect(config("TINY_SQL_TEST_DB"));

const tableName = `test_transactions`;

const newid = () => randomBytes(16).toString("hex");

const createTable = execSql(
  `if(not exists(select [name] from sys.tables where name = '${tableName}' )) exec sp_executesql N'create table [${tableName}] (id varchar(1024) NOT NULL UNIQUE)'`,
);

// const dropTable = execSql(`drop table [${tableName}]`);

const tableExists = connection =>
  execSql<{ exists: boolean }>(
    `select top 1 [exists]= CAST( (select  case when exists(select top 1 [name] from sys.tables where name = @tableName ) then 1 else 0 end) as BIT )`,
    { tableName },
  )(connection).then(({ values }) => values[0].exists);

const insertid = (id: string) =>
  execSql(`insert into [${tableName}] (id) VALUES (@id)`, {
    id,
  });

const findbyid = (id: string) => (connection: Connection) =>
  execSql<{ id: string }>(
    `select top 1 id from [${tableName}] where id = @id`,
    { id },
  )(connection).then(({ values }) => values && values[0] && values[0].id);

const count = (connection: Connection) =>
  execSql<{ count: number }>(`select [count]=count(*) from [${tableName}]`)(
    connection,
  ).then(({ values }) => values[0].count);

const clearTable = execSql(`delete ${tableName}`);

const { begin, commit, rollback } = transaction;

describe("transactions", () => {
  /** */
  it("Rollsback", async () => {

    await using(connect)(createTable);
    await using(connect)(clearTable);

    const id = newid();

    let connection: Connection;
    try {
      connection = await connect();
      await begin(connection);
      await insertid(id)(connection);
      // Unique constrain violated
      await insertid(id)(connection);
      await commit(connection);
    } catch (error) {
      await rollback(connection);
    } finally {
      connection && connection.close();
      connection = null;
    }
    
    expect(await using(connect)(tableExists)).toBe(true);
    expect(await using(connect)(findbyid(id))).toBe(undefined);
    expect(await using(connect)(count)).toBe(0);
    // await using(connect)(dropTable);
  });
   /** */
   it("Commits", async () => {

    await using(connect)(createTable);
    await using(connect)(clearTable);

    const id = newid();

    let connection: Connection;
    try {
      connection = await connect();
      await begin(connection);
      await insertid(id)(connection);      
      await commit(connection);
    } catch (error) {
      await rollback(connection);
    } finally {
      connection && connection.close();
      connection = null;
    }
    
    expect(await using(connect)(tableExists)).toBe(true);
    expect(await using(connect)(findbyid(id))).toBe(id);
    expect(await using(connect)(count)).toBe(1);
    // await using(connect)(dropTable);
  });
});
