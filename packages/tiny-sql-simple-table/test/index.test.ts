import _connect, { useConnection as using} from "@australis/tiny-sql-connect";
import getConfig from "@australis/tiny-sql-connection-config";
import { join } from "path";
import SimpleTable, { BasicTable } from "../src";
const DB = "TINY_SQL_TEST_DB";
const connect = () => _connect(getConfig(DB));
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
    const table = SimpleTable<Xyz>(
      "Xyz",
      `
      create table Xyz(
        id varchar(1024) NOT NULL UNIQUE default NEWID(),
        displayName varchar(max) NOT NULL,
        enabled bit not null default 0,
        nullable bit,
        createdAt DATETIME NOT NULL default GETDATE(),
        updatedAt DATETIME NOT NULL default GETDATE(),
      );
    `,
    );
    await using(connect)(table.drop);
    let ok = await using(connect)(table.init);
    expect(ok).toBe(true);
    //  try again ... if not exists
    ok = await using(connect)(table.init);
    expect(ok).toBe(true);

    const _new = await using(connect)(con =>
      table.add(con, { id: "x", displayName: "x" }),
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
        .join(" "),
    ).toMatch(today);
    expect(
      new Date(createdAt)
        .toString()
        .split(" ")
        .slice(0, 4)
        .join(" "),
    ).toMatch(today);
    const all = await using(connect)(table.all);
    expect(all[0].id).toBe("x");
    // UPDATE
    {
      const y = await using(connect)(c =>
        table.update(c, { id: "x", displayName: "y" }),
      );
      expect(y.displayName).toBe("y");
    }
    // FIND-BY
    const values = await using(connect)(c =>
      table.findBy(c, { displayName: "y" }),
    );
    // TODO:
    expect(values[0].displayName).toBe("y");

    const x = await using(connect)(table.all);
    expect(x.length).toBe(1);
  });
});
