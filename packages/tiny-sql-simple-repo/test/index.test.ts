import { join } from "path";
import { connected, BasicTable } from "../src";
/**
 *
 */
interface Xyz extends BasicTable {
  displayName: string;
  enabled: boolean;
}

const repo = (envKey?: string) => {
  const tableName = "Xyz";
  return {
    tableName,
    ...connected<Xyz>(
      tableName,
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
      envKey,
    ),
    envKey,
  };
};

/**
 *
 */
describe(require(join(__dirname, "../package.json")).name, function() {
  jest.setTimeout(100000);

  it("works", async () => {
    /**
     *
     */
    const { init, add, all, update, findBy, remove, drop, clear, exists } = repo(
      "TINY_SQL_TEST_DB",
    );
    // TODO:
    expect(typeof clear).toBe("function");
    
    await drop();
    expect(await exists()).toBe(false);
    let ok = await init();
    expect(ok).toBe(true);
    // 
    expect(await exists()).toBe(true);
    //  try again ... if not exists
    ok = await init();
    expect(ok).toBe(true);

    const _new = await add({ id: "x", displayName: "x" });
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
    const r = await remove("x");
    expect(r).not.toBeFalsy();
    const x = await all();
    expect(x.length).toBe(0);
  });
});
