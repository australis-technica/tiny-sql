const { default: execSql } = require("../lib");
const { default: Connect, using } = require("@australis/tiny-sql-connect");
const { default: config } = require("@australis/tiny-sql-connection-config");

const connect = () => Connect(config("TINY_SQL_TEST_DB"));

it("Demos", async () => {
  
  const createThings = execSql(`
      if(not(exists(select name from sys.tables where name = 'things'))) 
      exec sp_executesql  N'create table [things] ([id] int, [name] varchar(1024))'`);

  const clear = execSql(`delete [things]`);

  const selectStar = connection =>
    execSql(`select * from [things]`)(connection).then(({ values }) => values);

  const add = (id, name) =>
    execSql(`insert into [things] ([id], [name]) values (@id, @name)`, {
      id,
      name,
    });

  const things = await using(connect)(async connection => {
    await createThings(connection);
    await clear(connection);
    await add(1, "x")(connection);
    return selectStar(connection);
  });

  expect(things).toMatchObject([{ id: 1, name: "x" }]);
});
