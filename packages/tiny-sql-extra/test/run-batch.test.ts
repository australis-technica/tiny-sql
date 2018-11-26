import _connect, { useConnection as using} from "@australis/tiny-sql-connect";
import getConfig from "@australis/tiny-sql-connection-config";
const connect = () => _connect(getConfig("TINY_SQL_TEST_DB"));

describe("run-batch", () => {
  it("works", async () => {
    const runBatch = (await import("../src/run-batch")).default;
    const run = runBatch(`
        select 0 as ok;
        GO
        select 1 as ok;
        GO
        `);
    const results = await using(connect)(run);
    expect((results[0] as any).values[0].ok).toBe(0);
    expect((results[1] as any).values[0].ok).toBe(1);
    expect(results.length).toBe(2);
  });
});