import { Connection } from "tedious";

const begin = (connection: Connection) =>
  new Promise((resolve, reject) =>
    connection.beginTransaction(error => {
      if (error) reject(error);
      else resolve();
    }),
  );
  
const commit = (connection: Connection) =>
  new Promise((resolve, reject) =>
    connection.commitTransaction(error => {
      if (error) reject(error);
      else resolve();
    }),
  );

const rollback = (connection: Connection) =>
  new Promise((resolve, reject) =>
    connection.rollbackTransaction(error => {
      if (error) reject(error);
      else resolve();
    }),
  );
  
export default {
  begin,
  commit,
  rollback
}