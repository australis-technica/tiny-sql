import { Connection, ConnectionConfig } from "tedious";
import { isConnection } from "./is-connection";
/** */
export default function connectFactory(args: ConnectionConfig | Connection) {
  /** */
  const connection = isConnection(args) ? args : new Connection(args);
  /** */
  return () =>
    new Promise<Connection>((resolve, reject) => {
      try {
        connection.on("connect", (err: Error | string) => {
          if (err) return reject(err);
          return resolve(connection);
        });
        connection.on("error", (error: { code?: any } & Error) => {
          return reject(error);
        });
      } catch (error) {
        return reject(error);
      }
    });
}
