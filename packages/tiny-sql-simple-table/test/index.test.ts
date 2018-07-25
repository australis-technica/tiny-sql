process.env.NODE_ENV = "test";
import "@australis/load-env";
import connectToServer from "@australis/tiny-sql-connect-to-server";
import connect from "@australis/tiny-sql-connection-factory";
import ExecSql from "@australis/tiny-sql-exec-sql";
import withSqlConnection from "@australis/tiny-sql-with-sql-connection";
import { join } from "path";
import SimpleTable, { BasicTable } from "../src";
/** */
beforeAll(async () => {
  await withSqlConnection(connectToServer, con =>
    ExecSql(con)(
      "if(exists(select name from sys.databases where name = 'testdb')) drop database testdb"
    )
  );
  await withSqlConnection(connectToServer, con =>
    ExecSql(con)(
      "if(not(exists(select name from sys.databases where name = 'testdb'))) create database testdb"
    )
  );
});
/**
 * 
 */
interface Xyz extends BasicTable {
  displayName: string;
  enabled: boolean;
}


/**
 *
 */
describe(require(join(__dirname, "../package.json")).name, () => {
  it("works", async () => {
    /**
     * 
     */
    const table = SimpleTable<Xyz>("Xyz", `
      create table Xyz(
        id varchar(1024) NOT NULL UNIQUE default NEWID(),
        displayName varchar(max) NOT NULL,
        enabled bit not null default 0,
        nullable bit,
        createdAt DATETIME NOT NULL default GETDATE(),
        updatedAt DATETIME NOT NULL default GETDATE(),
      );
    `);

    let ok = await withSqlConnection(connect, table.init);
    expect(ok).toBe(true);
    //  try again ... if not exists
    ok = await withSqlConnection(connect, table.init);
    expect(ok).toBe(true);

    const _new = await withSqlConnection(connect, con =>
      table.add(con, { id: "x", displayName: "x" })
    );
    const { id, displayName, enabled, createdAt, updatedAt } = _new;
    expect(id).toBe("x");
    expect(displayName).toBe("x");
    expect(enabled).toBe(false);
    // ...    
    const today = new Date(Date.now())
      .toString()
      .split(" ")
      .slice(0, 4)
      .join(" ");
    expect(
      new Date(updatedAt)
        .toString()
        .split(" ")
        .slice(0, 4)
        .join(" ")
    ).toMatch(today);
    expect(
      new Date(createdAt)
        .toString()
        .split(" ")
        .slice(0, 4)
        .join(" ")
    ).toMatch(today);
    const all = await withSqlConnection(connect, table.all);
    expect(all[0].id).toBe("x");
    // UPDATE
    {
      const y = await withSqlConnection(connect, c => table.update(c, { id: "x", displayName: "y" }));
      expect(y.displayName).toBe("y");
    }
    // FIND-BY
    const values = await withSqlConnection(connect, c => table.findBy(c, { displayName: "y" }));
    // TODO:
    expect(values[0].displayName).toBe("y");
    const { affected } = await withSqlConnection(connect, c => table.remove(c, "x"));
    expect(affected.reduce((prev, next) => prev + next)).toBe(1);
    const x = await withSqlConnection(connect, table.all);
    expect(x.length).toBe(0);
  });
});
