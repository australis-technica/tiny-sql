import { Connection } from "tedious";
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
      console.error(e);
      return Promise.reject(e);
    } finally {    
      conn && conn.close();
    }
  }