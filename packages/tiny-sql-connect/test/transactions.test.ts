import { factory as Connect, using } from "@australis/tiny-sql-connect";
import config from "@australis/tiny-sql-connection-config";
import { Connection } from "tedious";
import execSql from "@australis/tiny-sql-exec-sql";
import { randomBytes } from "crypto";

import { begin, commit, rollback } from "../src/transaction";

const connect = Connect(config("TINY_SQL_TEST_DB"));


describe("transactions", () => {
  it("Works", async () => {
    const tableName = `my_transactions`;
    const newid = () => randomBytes(16).toString("hex");

    const createTable = await execSql(
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

    await using(connect)(createTable);

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

    const exists = await using(connect)(tableExists);
    expect(exists).toBe(true);
    expect(await using(connect)(findbyid(id))).toBe(undefined);
    expect(await using(connect)(count)).toBe(0);
    // await using(connect)(dropTable);
  });
});
