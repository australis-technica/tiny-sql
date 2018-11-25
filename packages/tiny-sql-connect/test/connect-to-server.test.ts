import execSql from "@australis/tiny-sql-exec-sql";
import connectToServer from "../src/connect-to-server";
import { join } from "path";
import { Connection } from "tedious";

describe((require(join(__dirname, "../package.json"))).name, () => {
    it("works", async () => {
        let connection: Connection;
        try {
            connection = await connectToServer("TINY_SQL_TEST_DB");
            const r = await execSql<{ name: any }>("select name from sys.databases")(connection);            
            const names = r.values.map(x => x.name).join(",");
            expect(names.indexOf("master") !== -1).toBe(true);
        } finally {
            connection && connection.close();
        }
    })
});