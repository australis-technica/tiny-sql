import connect from "@australis/tiny-sql-connect";
import getConfig from "@australis/tiny-sql-connection-config";
import { Exec } from "@australis/tiny-sql-exec-sql";
import { Connection } from "tedious";
import { connected as JsonTable } from "../src";

const TABLE_NAME = "kv";
const kv = JsonTable(TABLE_NAME, "TINY_SQL_TEST_DB");

beforeAll(async () => {
  let connection: Connection;
  try {
    const config = getConfig("TINY_SQL_TEST_DB");
    if (!config || !config.options || !config.options.database) {
      throw new Error("BAD configuration");
    }
    connection = await connect(config);
    await Exec(
      `if(exists(select 1 from sys.tables where name = '${TABLE_NAME}')) drop table ${TABLE_NAME}`
    )(connection);
  } finally {
    connection && connection.close();
  }
})

describe("Json Table", () => {

  it("inits", async () => {
    jest.setTimeout(10000);
    let connection: Connection;
    await kv.init();
    try {
      connection = await connect(getConfig("TINY_SQL_TEST_DB"));
      const table = await Exec<{ name: string }>(
        `select top 1 name from sys.tables where name = '${kv.tableName}'`
      )(connection).then(x => x.values[0]);
      expect(table.name).toBe(kv.tableName);
    } catch (e) {
      throw e;
    }
    finally {
      connection && connection.close();
    }
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
  })
  it("get/set/remove", async () => {                
    expect(await kv.exists("zzz")).toBe(false);
    await kv.set("zzz", "z");
    expect(await kv.get("zzz")).toBe("z");  
    await  kv.clear();
    expect(await kv.count()).toBe(0);
    await kv.set("zzz", "z");
    expect(await kv.get("zzz")).toBe("z");  
    await kv.remove("zzz");
    expect(await kv.get("zzz")).toBe(undefined);  
  })
});