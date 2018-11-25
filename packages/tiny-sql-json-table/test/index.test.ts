import _connect from "@australis/tiny-sql-connect";
import getConfig from "@australis/tiny-sql-connection-config";
import execSql from "@australis/tiny-sql-exec-sql";
import using from "@australis/tiny-sql-use-connection";
import { connected as JsonTable } from "../src";
import { TYPES, Connection } from "tedious";
import { TediousParameter } from "@australis/tiny-sql-params";

const TABLE_NAME = "kv";
const kv = JsonTable(TABLE_NAME, "TINY_SQL_TEST_DB");

const connect = () => _connect(getConfig("TINY_SQL_TEST_DB"));

const tableExists = (tableName: string) => (connection: Connection) =>
  execSql<{ exists: boolean }>(
    "select @exists=(case when (exists (select name from sys.tables where name = @tableName)) then 1 else 0 end)",
    [
      {
        tableName,
      },
      {
        name: "exists",
        type: TYPES.Bit,
        out: true,
        value: undefined,
      } as TediousParameter,
    ],
  )(connection).then(({ values }) => values[0].exists);

beforeAll(async () => {
  await kv.drop();
  expect(await using(connect)(tableExists(kv.tableName))).toBe(false);
});

describe("Json Table", () => {
  it("inits", async () => {
    await kv.init();
    expect(await using(connect)(tableExists(kv.tableName))).toBe(true);
  });

  it("sets defaults", async () => {
    const defaults = { x: "x", y: 1, z: [1] };
    await kv.defaults(defaults);
    // Try Override
    await kv.defaults({ x: "y", y: 2, z: [2] });
    // Should have not
    expect(await kv.get("x")).toBe(defaults.x);
    expect(await kv.get("y")).toBe(defaults.y);
    expect(await kv.get("z")).toMatchObject(defaults.z);
  });

  it("get/set/remove", async () => {
    expect(await kv.exists("zzz")).toBe(false);
    await kv.set("zzz", "z");
    expect(await kv.get("zzz")).toBe("z");
    await kv.clear();
    expect(await kv.count()).toBe(0);
    await kv.set("zzz", "z");
    expect(await kv.get("zzz")).toBe("z");
    await kv.remove("zzz");
    expect(await kv.get("zzz")).toBe(undefined);
  });
});
