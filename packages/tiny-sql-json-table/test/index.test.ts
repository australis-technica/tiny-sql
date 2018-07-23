import ExecSql from "@australis/tiny-sql-exec-sql";
import connect from "@australis/tiny-sql-connect";
import { Connection } from "tedious";
import JsonTable from "../src";

const server = "localhost";
const userName = "sa    ";
const password = "P@55w0rd!";
const database = "testdb";

async function initTestDb(
  server: string,
  userName: string,
  password: string,
  database: string
) {
  let connection: Connection;
  try {
    connection = await connect({
      server,
      userName,
      password
    });
    const execSql = ExecSql(connection);
    await execSql(
      `if(exists(select 1 from sys.databases where name = '${database}')) drop database ${database}`
    );
    await execSql(`create DATABASE ${database}`);
  } finally {
    connection && connection.close();
  }
}

function newConnection() {
  return connect({
    server,
    userName,
    password,
    options: {
      database
    }
  });
}

describe("init", () => {  
  it("works", async () => {
    jest.setTimeout(10000);
    await initTestDb(server, userName, password, database);
    let connection: Connection;
    try {      
      const jsonTable = JsonTable("jsons");
      connection = await newConnection();
      const execSql = ExecSql(connection);
      // ..
      await jsonTable.init(connection);
      const table = await execSql<{ name: string }>(
        "select top 1 name from sys.tables where name = 'jsons'"
      ).then(x => x.values[0]);
      // expect table to exists
      expect(table.name).toBe("jsons");
      // expect to be empty 
      const values = await execSql("select * from jsons").then(x=>x.values[0] || {});
      expect(values)
        .toMatchObject({});
      // expect defaults to be populated
      const defaults = { x: "x", y: 1 , z: [ 1] };
      await jsonTable.defaults(connection, defaults);      
      const expected = [{key: 'x', value: '"x"'}, { key: 'y', value: '1'}, { key: 'z', value: '[1]'}];
      expect(await ExecSql(connection)("select * from jsons").then(x=>x.values))
        .toMatchObject(expected);
     // expect to skip existing values
        await jsonTable.defaults(connection, Object.assign(defaults, {
            x: "y",
            y: 2,
            z: [2]
        }));    
        expect(await ExecSql(connection)("select * from jsons").then(x=>x.values))
        .toMatchObject(expected);
    } finally {
      connection && connection.close();
    }
  });
});