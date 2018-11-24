import connect from "@australis/tiny-sql-connect";
import getConfig from "@australis/tiny-sql-connection-config";
import using from "@australis/tiny-sql-use-connection";

describe("run-batch-scipt", () => {
  it("works", async () => {
    const runBatch = (await import("../src")).default;
    const run = runBatch(`
        select 0 as ok;
        GO
        select 1 as ok;
        GO
        `);    
    const results = await using(()=> connect(getConfig("TINY_SQL_TEST_DB")))(run);
    expect((results[0] as any).values[0].ok).toBe(0);
    expect((results[1] as any).values[0].ok).toBe(1);
    expect(results.length).toBe(2);
  });
});
