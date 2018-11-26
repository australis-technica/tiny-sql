import { Connection } from "tedious";
import { debugModule } from "@australis/create-debug";
import unwrap, { Connectable } from "./unwrap";

const debug = debugModule(module);

type Callback<T> = (connection: Connection) => Promise<T>;
/**
 * close connection from Connectable  after use,\
 */
export default (connect: Connectable) => async <T>(callback: Callback<T>) => {
  let connection: Connection;
  try {
    connection = await unwrap(connect);
    const r = await callback(connection);
    return Promise.resolve(r);
  } catch (e) {
    debug(e);
    return Promise.reject(e);
  } finally {
    if (connection) connection.close();
  }
};

