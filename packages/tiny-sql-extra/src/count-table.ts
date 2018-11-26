import Exec from "@australis/tiny-sql-exec-sql";
import { Connection } from "tedious";

export default (tableName: string) =>
    (connection: Connection) =>
        Exec<{ count: number }>(`select count = count(*) from ${tableName}`)(connection)
            .then(({ values }) => values[0].count);