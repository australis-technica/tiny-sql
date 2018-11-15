process.env.NODE_ENV = "test";
import "@australis/load-env";
import { join } from "path";
import { connected, BasicTable } from "../src";
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
    const { init, add, all, update, findBy, remove} = connected<Xyz>("Xyz", `
      create table Xyz(
        id varchar(1024) NOT NULL UNIQUE default NEWID(),
        displayName varchar(max) NOT NULL,
        enabled bit not null default 0,
        nullable bit,
        createdAt DATETIME NOT NULL default GETDATE(),
        updatedAt DATETIME NOT NULL default GETDATE(),
      );
    `);

    let ok = await init();
    expect(ok).toBe(true);
    //  try again ... if not exists
    ok = await init();
    expect(ok).toBe(true);

    const _new = await add({ id: "x", displayName: "x" })
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
    const _all = await all();
    expect(_all[0].id).toBe("x");
    // UPDATE
    {
      const y = await update({ id: "x", displayName: "y" });
      expect(y.displayName).toBe("y");
    }
    // FIND-BY
    const values = await findBy({ displayName: "y" });
    // TODO:
    expect(values[0].displayName).toBe("y");
    const { affected } = await remove("x");
    expect(affected.reduce((prev, next) => prev + next)).toBe(1);
    const x = await all();
    expect(x.length).toBe(0);
  });
});
