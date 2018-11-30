import config from "@australis/tiny-sql-connection-config";
import execSql from "@australis/tiny-sql-exec-sql";
import { factory, using } from "../src";

const connect = factory(config("TINY_SQL_TEST_DB"));
/** */
export const getValue = x => connection =>
  execSql<{ x: any }>("select x=@x", { x })(connection).then(
    x => x.values[0].x,
  );
/**
 * ?
 */
describe("use-connection", () => {
  it("from connection", async () => {
    let connection = await connect();
    const value = await using(connection)(getValue(1));
    expect(value).toBe(1);
    expect((connection as any).closed).toBe(true);
  });

  it("from promise", async () => {
    let connection = connect();
    const value = await using(connection)(getValue(1));
    expect(value).toBe(1);
    expect(((await connection) as any).closed).toBe(true);
  });

  it("from function -> promise ", async () => {
    const { value, connection } = await using(connect)(async connection => {
      return {
        value: await getValue(1)(connection),
        connection,
      };
    });
    expect(value).toBe(1);
    expect((connection as any).closed).toBe(true);
  });

  it("from function -> connection ", async () => {
    const connection = await connect();
    const f = () => connection;
    const value = await using(f)(getValue(1));
    expect(value).toBe(1);
    expect((connection as any).closed).toBe(true);
  });
});
