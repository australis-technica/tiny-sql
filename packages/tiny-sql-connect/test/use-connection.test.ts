import execSql from "@australis/tiny-sql-exec-sql";
import useConnection from "../src/use-connection";
import connect from "../src/connect-to-server";
/** */
const getValue = x => connection =>
  execSql<{ x: any }>("select x=@x", { x })(connection).then(
    x => x.values[0].x,
  );
/**
 * ?
 */
describe("use-connection", () => {
  it("works", async () => {
    const value = await useConnection(() => connect("TINY_SQL_TEST_DB"))(
      getValue(1),
    );
    expect(value).toBe(1);
  });
});
