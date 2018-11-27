import _connect, { using } from "@australis/tiny-sql-connect";
import { connected as JsonTable } from "../src";
const kv = JsonTable("kv", "TINY_SQL_TEST_DB");

describe("Json Table", () => {

  it("works", async () => {
    await kv.drop();
    expect(await kv.exists()).toBe(false);
    await kv.init();
    expect(await kv.exists()).toBe(true);
    const defaults = { x: "x", y: 1, z: [1] };
    await kv.defaults(defaults);
    // Try Override
    await kv.defaults({ x: "y", y: 2, z: [2] });
    // Should have not
    expect(await kv.get("x")).toBe(defaults.x);
    expect(await kv.get("y")).toBe(defaults.y);
    expect(await kv.get("z")).toMatchObject(defaults.z);
    expect(await kv.count()).toBe(3);

    await kv.clear();
    expect(await kv.count()).toBe(0);

    expect(await kv.keyExists("zzz")).toBe(false);
    await kv.set("zzz", "z");
    expect(await kv.count()).toBe(1);
    expect(await kv.keyExists("zzz")).toBe(true);
    expect(await kv.get("zzz")).toBe("z");
    await kv.clear();
    expect(await kv.count()).toBe(0);
    await kv.set("zzz", "z");
    expect(await kv.get("zzz")).toBe("z");
    const r = await kv.remove("zzz");
    expect(await kv.get("zzz")).toBe(undefined);
    expect(r.values.length).toBe(0);
  });
});
