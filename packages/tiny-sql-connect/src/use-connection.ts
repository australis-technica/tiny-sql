import { Connection } from "tedious";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/** */
export default function using(getConnection: () => Promise<Connection>) {
  /** */
  return async <T>(callback: (connection: Connection) => T): Promise<T> => {
    let connection: Connection;
    try {
      connection = await getConnection();
      const r = await callback(connection);
      return Promise.resolve(r);
    } catch (e) {
      debug(e);
      return Promise.reject(e);
    } finally {
      connection && connection.close();
    }
  }
}