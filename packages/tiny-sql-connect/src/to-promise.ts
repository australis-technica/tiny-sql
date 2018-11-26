import { Connection } from "tedious";
/** */
const toPromise = (connection: Connection) => new Promise<Connection>((resolve, reject) => {
  try {
    connection.on("connect", (err: Error | string) => {
      if (err)
        return reject(err);
      return resolve(connection);
    });
    connection.on("error", (error: {
      code?: any;
    } & Error) => {
      return reject(error);
    });
  }
  catch (error) {
    return reject(error);
  }
});
export default toPromise;