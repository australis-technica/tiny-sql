import { join } from "path";
import connect from "@australis/tiny-sql-connect/lib/connect-to-server";
import execSql from "@australis/tiny-sql-exec-sql";
import useConnection from "../src";
/** */
const getValue = x => connection =>
  execSql<{ x: any }>("select x=@x", { x })(connection).then(
    x => x.values[0].x,
  );
/**
 * ?
 */
describe(require(join(__dirname, "../package.json")).name, () => {
  /**
   *
   */
  it("works", async () => {
    const value = await useConnection(() => connect("TINY_SQL_TEST_DB"))(
      getValue(1),
    );
    expect(value).toBe(1);
  });
});
