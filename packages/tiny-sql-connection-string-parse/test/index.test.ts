describe("parse-connection-string", () => {
  it("works", async () => {
      const parseString = (await import("../src")).default;
      const connectionConfig = parseString("Data Source=localhost;user=sa;password=P@55w0rd!;Initial Catalog=MyDb");
      expect(connectionConfig.server).toEqual("localhost");
      expect(connectionConfig.userName).toEqual("sa");
      expect(connectionConfig.password).toEqual("P@55w0rd!");
      expect(connectionConfig.options.database).toEqual("MyDb");
      expect(connectionConfig.options.encrypt).toBe(false);
  })
  it("works1", async () => {
    const parseString = (await import("../src")).default;
    const connectionConfig = parseString("Data Source=localhost;user=sa;password=P@55w0rd!;Initial Catalog=MyDb;encrypt=true");
    expect(connectionConfig.server).toEqual("localhost");
    expect(connectionConfig.userName).toEqual("sa");
    expect(connectionConfig.password).toEqual("P@55w0rd!");
    expect(connectionConfig.options.database).toEqual("MyDb");
    expect(connectionConfig.options.encrypt).toBe(true);
})
})