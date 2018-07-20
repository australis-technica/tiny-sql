import { Connection } from "tedious";
process.env.NODE_ENV = "test";
import "@australis/load-env";
/** */
describe("new-connection", () => {
    it("works", async () => {
        let connection: Connection;
        try {
            connection = await (await import("../src")).default();
            expect(connection.execSql).toBeInstanceOf(Function);            
        } finally {
            connection && connection.close();
        }
    })
})