import { Connection } from "tedious";
process.env.NODE_ENV = "test";
/** */
describe("env-connection-factory", () => {
    it("works", async () => {
        let connection: Connection;
        try {
            connection = await (await import("../src/env-connection-factory")).default("TINY_SQL_TEST_DB");
            expect(connection.execSql).toBeInstanceOf(Function);            
        } finally {
            connection && connection.close();
        }
    })
})