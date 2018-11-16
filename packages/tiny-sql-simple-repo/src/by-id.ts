import { debugModule } from "@australis/create-debug";
import { Exec } from "@australis/tiny-sql-exec-sql";
import { Connection } from "tedious";
const debug = debugModule(module);
/** */
export default <T>(tableName: string) => (id: string | number) => async (
  connection: Connection,
): Promise<T> => {
  try {
    const result = await Exec<T>(
      `select top 1 * from ${tableName} where id = @id`,
      { id },
    )(connection);
    return Promise.resolve(result.values[0]);
  } catch (error) {
    debug(error);
    throw error;
  }
};
