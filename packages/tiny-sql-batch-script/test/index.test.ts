import { Connection } from "tedious";
import connect from "@australis/tiny-sql-connect";
import { join } from "path";
import { isError } from "util";

const connectionConfig = require(join(__dirname, "../.secrets/connection-config.json"));

describe("run-batch-scipt", ()=>{
    it("works", async ()=> {
        const runBatch = (await import("../src")).default;
        let connection: Connection;
        try {
            connection = await connect(connectionConfig);
            const results = await runBatch(connection, "batch.sql", {
                // bail: true,
                scriptsHome: join(__dirname, "./")
            });            
            expect((results[0] as any).values[0].ok).toBe(0);
            expect((results[1] as any).values[0].ok).toBe(1);
            expect(results.length).toBe(2);
            expect(results.filter(x=> isError(x)).length).toBe(0);
        } finally {
            connection && connection.close();
        }
    })
})