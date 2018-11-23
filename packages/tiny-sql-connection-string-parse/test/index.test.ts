import { ConnectionConfig } from "tedious";

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
        expect(parseString("user id=sa").userName).toBe("sa");
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
    it("works with nothing", async () => {
        const parseString = (await import("../src")).default;
        expect(parseString("")).toMatchObject({
            options: {}
        })
        expect(parseString(undefined)).toMatchObject({});
    })
    it("works with dsn like", async () => {
        const { default: parse } = await import("../src");
        expect(parse("mssql://sa:pass@localhost\\instance:1444/db?encrypt=true")).toMatchObject({
            server: "localhost\\instance",
            userName: "sa",
            password: "pass",
            options: {
                database: "db",
                port: 1444,
                encrypt: true
            }
        } as ConnectionConfig)
        expect(parse("mssql://sa:pass@localhost\\instance:1444/db")).toMatchObject(
            {
                server: "localhost\\instance",
                userName: "sa",
                password: "pass",
                options: {
                    database: "db",
                    port: 1444,
                    encrypt: false
                }
            }
        );
        expect(parse("mssql://sa:pass@localhost:1444/db")).toMatchObject({
            server: "localhost",
            userName: "sa",
            password: "pass",
            options: {
                database: "db",
                port: 1444,
                encrypt: false
            }
        });
        expect(parse("sql://sa:@localhost")).toMatchObject({
            server: "localhost",
            userName: "sa",
            password: "",
            options: {
                database: "",
                port: 0,
                encrypt: false
            }
        });
        expect(parse("sql://sa@localhost")).toMatchObject({
            server: "localhost",
            userName: "sa",
            password: "",
            options: {
                database: "",
                port: 0,
                encrypt: false
            }
        });
        expect(parse("tedious://localhost")).toMatchObject({
            server: "localhost",
            userName: "",
            password: "",
            options: {
                database: "",
                port: 0,
                encrypt: false
            }
        });
    })
});
