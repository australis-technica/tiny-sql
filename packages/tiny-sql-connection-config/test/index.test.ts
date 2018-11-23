beforeAll(() => {
    process.env.DB = "sql://xyz/db";
    process.env.DB1 = "sql://abc/db1";
});
/** */
describe("connection-config", () => {
    it("works without parameters", async () => {
        const connectionConfig = (await import("../src")).default();
        expect(connectionConfig.server).toEqual("xyz");
        expect(connectionConfig.options.database).toEqual("db");
    })
    it("works with parameters", async () => {
        const connectionConfig = (await import("../src")).default("DB1");
        expect(connectionConfig.server).toEqual("abc");
    })
    it("changes key", async () => {
        const connectionConfig = (await import("../src")).default();
        expect(connectionConfig.server).toEqual("xyz");
    })
});