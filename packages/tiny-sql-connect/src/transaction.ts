import { Connection } from "tedious";

export const begin = (connection: Connection) =>
  new Promise((resolve, reject) =>
    connection.beginTransaction(error => {
      if (error) reject(error);
      else resolve();
    }),
  );
  
export const commit = (connection: Connection) =>
  new Promise((resolve, reject) =>
    connection.commitTransaction(error => {
      if (error) reject(error);
      else resolve();
    }),
  );

export const rollback = (connection: Connection) =>
  new Promise((resolve, reject) =>
    connection.rollbackTransaction(error => {
      if (error) reject(error);
      else resolve();
    }),
  );
