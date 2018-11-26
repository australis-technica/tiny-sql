import connect from "@australis/tiny-sql-connect/lib/connect-to-server";
import execSql from "@australis/tiny-sql-exec-sql";
import withConnection from "../src/with-connection";
/**
 * ?
 */
describe("with-connection", () => {
  /**
   *
   */
  it("works", async () => {
    // TODO: test connection closed
    // TODO: test catches error
    expect(
      await withConnection(
        () => connect("TINY_SQL_TEST_DB"),
        connection =>
          execSql<{ id: any }>("select id=1")(connection).then(
            x => x.values[0].id,
          ),
      ),
    ).toBe(1);
  });
});
