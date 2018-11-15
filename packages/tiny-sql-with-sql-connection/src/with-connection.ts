import { Connection } from "tedious";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/** */
export default async function withConnection<T>(
    f: () => Promise<Connection>,
    callback: (c: Connection) => Promise<T>
  ) {
    let conn: Connection;
    try {    
      conn = await f();
      const r = await callback(conn);    
      return Promise.resolve(r);
    } catch (e) {
      debug(e);
      return Promise.reject(e);
    } finally {    
      conn && conn.close();
    }
  }