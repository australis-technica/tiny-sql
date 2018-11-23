describe("parse-connection-string", () => {
  it("works", async () => {
    const parseString = (await import("../src")).default;
    const connectionConfig = parseString(
      "Data Source=localhost,1444;user=sa;password=P@55w0rd!;Initial Catalog=MyDb",
    );
    expect(connectionConfig.server).toEqual("localhost");
    expect(connectionConfig.userName).toEqual("sa");
    expect(connectionConfig.password).toEqual("P@55w0rd!");
    expect(connectionConfig.options.database).toEqual("MyDb");
    expect(connectionConfig.options.encrypt).toBe(false);
    expect(connectionConfig.options.port).toBe(1444);
    expect(
        parseString("Data Source=localhost:1444").options.port
    ).toBe(1444)
    expect(
        parseString("DataSource=localhost").server
    ).toBe("localhost")
    expect(
        parseString("DataSource=.").server
    ).toBe("localhost")
    expect(
        parseString("server=.").server
    ).toBe("localhost")
    expect(
        parseString("DataSource=(local)").server
    ).toBe("localhost");
    expect(
        parseString("Initial Catalog=db").options.database
    ).toBe("db");
    expect(
        parseString("Initial        Catalog=db").options.database
    ).toBe("db");
    expect(
        parseString("InitialCatalog=db").options.database
    ).toBe("db");
    expect(
        parseString("database=db").options.database
    ).toBe("db");
  });
  it("works1", async () => {
    const parseString = (await import("../src")).default;
    const connectionConfig = parseString(
      "Data Source=localhost;user=sa;password=P@55w0rd!;Initial Catalog=MyDb;encrypt=true",
    );
    expect(connectionConfig.server).toEqual("localhost");
    expect(connectionConfig.userName).toEqual("sa");
    expect(connectionConfig.password).toEqual("P@55w0rd!");
    expect(connectionConfig.options.database).toEqual("MyDb");
    expect(connectionConfig.options.encrypt).toBe(true);
  });
});
