import ExecSql from "../src";
import connect from "@australis/tiny-sql-connect";
import getConfig from "@australis/tiny-sql-connection-config";
import using from "@australis/tiny-sql-use-connection";
import { TediousParameter } from "@australis/tiny-sql-params";
import { TYPES } from "tedious";

const exec = (sql: string, params?: any) =>
  using(() => connect(getConfig("TINY_SQL_TEST_DB")))(ExecSql(sql, params));
/**
 * Create stored proc
 */
const createTinyEcho = async () => {
  await exec(`
    IF EXISTS (SELECT * FROM SYS.procedures WHERE [name] = 'tiny_echo' ) 
    DROP PROCEDURE tiny_echo
    `);
  await exec(`
    CREATE PROCEDURE tiny_echo @what varchar(max) AS SELECT @what
    `);
};

beforeAll(async () => {
  await createTinyEcho();
});

/** */
it("execs with connection", async () => {
  const { values } = await using(() => connect(getConfig("TINY_SQL_TEST_DB")))(
    ExecSql<{ name: string }>("select 'x' as name"),
  );
  expect(values[0].name).toBe("x");
});
/** */
it("execs with params", async () => {
  const { values } = await using(() => connect(getConfig("TINY_SQL_TEST_DB")))(
    ExecSql<{ name: string }>("select @name as name", { name: "me" }),
  );
  expect(values[0].name).toBe("me");
});

it("execs procs", async () => {
  const { values } = await using(() => connect(getConfig("TINY_SQL_TEST_DB")))(
    ExecSql<any>("exec tiny_echo @what", { what: "hello" }),
  );
  // proc doesn't declare a column name
  // index is used instead
  expect(values[0][0]).toBe("hello");
});

it("execs output params", async () => {
  const { values } = await using(() => connect(getConfig("TINY_SQL_TEST_DB")))(
    ExecSql<any>(
      `
    select @x = count(*) from sys.databases where name = 'master'      
    `,      
      [{ name: "x", type: TYPES.Int, out: true } as TediousParameter],
    ),
  );
  expect(values[0].x).toBe(1);
});
it("may fail", async () => {
  {
    const { values } = await using(() =>
      connect(getConfig("TINY_SQL_TEST_DB")),
    )(
      ExecSql<any>(`select @number=42, @answer='foo'`, [
        { name: "number", type: TYPES.Int, out: true },
        { name: "answer", type: TYPES.NVarChar, out: true },
      ]),
    );
    expect(values[0].number).toBe(42);
    expect(values[0].answer).toBe("foo");
  }
});
/**
 * Fails why is value truncated ?
 */
it("execs output params (varchar?)", async () => {
  const { values } = await using(() => connect(getConfig("TINY_SQL_TEST_DB")))(
    ExecSql<any>(
      `
      select @xname = [name] from sys.databases where name = 'master';
    `,
      {
        name: "xname",
        type: TYPES.VarChar,
        length: 1024,
        value: "",
        out: true
      } as TediousParameter,
    ),
  );
  expect(values[0].xname).toBe("master");
});
