import { join } from "path";
import _connect, { using} from "@australis/tiny-sql-connect";
import getConfig from "@australis/tiny-sql-connection-config";
import execSql from "@australis/tiny-sql-exec-sql";

const connect = () => _connect(getConfig("TINY_SQL_TEST_DB"));
import tableExists from "../src/table-exists";

const pkg = require(join(__dirname, "../package.json"));
/** */
describe(pkg.name, async () => {
  /*  */
  it("table exists", async () => {
    const tableName = "x";
    await using(connect)(
      execSql(
        `if(exists(select name from sys.tables where name = @tableName))
         drop table [${tableName}]`,
        { tableName },
      ),
    );
    expect(await using(connect)(tableExists("x"))).toBe(false);
    await using(connect)(
      execSql(
        `if(not(exists(select name from sys.tables where name = @tableName))) 
        exec sp_executesql  N'create table [${tableName}] ([id] int)';
        `,
        { tableName },
      ),
    );
    expect(await using(connect)(tableExists(tableName))).toBe(true);
  });
});


