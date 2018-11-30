import toServer from "../src/to-server";
/** */
describe("connect-to-server", () => {
    it("works", async () => {
        const { server, options } = toServer({ server: "localhost", options: { database: "?" } });
        expect(options.database).toBe(undefined);
        expect(server).toBe("localhost");
        expect(toServer({ server: "localhost" }).options).toMatchObject({});
        expect(toServer({}).options).toMatchObject({});
    })
});