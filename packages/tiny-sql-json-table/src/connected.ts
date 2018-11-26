import connect from "./connect";
import { useConnection as using } from "@australis/tiny-sql-connect";
import Repo from "./repo";
/** */
export default (tableName: string, envKey = "DB") => {
  const repo = Repo(tableName);
  return {
    tableName,
    defaults: (x: {}) => using(connect(envKey))(repo.defaults(x)),
    get: (key: string) => using(connect(envKey))(repo.get(key)),
    init: () => using(connect(envKey))(repo.init),
    exists: (key: string) => using(connect(envKey))(repo.exists(key)),
    set: (key: string, value: any) =>
      using(connect(envKey))(repo.set(key, value)),
    remove: (key: string) => using(connect(envKey))(repo.remove(tableName)),
    clear: () => using(connect(envKey))(repo.clear),
    count: () => using(connect(envKey))(repo.count),
    drop: () => using(connect(envKey))(repo.drop),
  }
};
