import config from "@australis/tiny-sql-connection-config";
import { Connection } from "tedious";
import connectFactory from "../src/connect-factory";
const connect = connectFactory(config("TINY_SQL_TEST_DB"));
/** */
describe("env-connection-factory", () => {
    it("works", async () => {
        let connection: Connection;
        try {
            connection = await connect();
            expect(connection).toBeInstanceOf(Connection);
        } finally {
            connection && connection.close();
        }
    })
})