import "@australis/load-env";
import { join } from "path";
import connect from "@australis/tiny-sql-connect-to-server";
import execSql from "@australis/tiny-sql-exec-sql";
import withConnection from "../src";
/**
 * ?
 */
describe(require(join(__dirname, "../package.json")).name, () => {
  /**
   * 
   */
  it("works", async () => {
    // TODO: test connection closed
    // TODO: test catches error
    expect(await withConnection(connect, connection => execSql(connection)<{ id: any }>("select id=1")).then(x => x.values[0].id))
      .toBe(1)
  });
});
