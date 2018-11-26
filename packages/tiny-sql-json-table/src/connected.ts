import connect from "@australis/tiny-sql-extra/lib/connect-to-env";
import { useConnection as using } from "@australis/tiny-sql-connect";
import Repo from "./repo";
/** */
export default (tableName: string, envKey = "DB") => {
  const repo = Repo(tableName);
  return {
    tableName,
    defaults: (x: {}) => using(connect(envKey))(repo.defaults(x)),
    get: (key: string) => using(connect(envKey))(repo.get(key)),
    exists: () => using(connect(envKey))(repo.exists),
    init: () => using(connect(envKey))(repo.init),
    keyExists: (key: string) => using(connect(envKey))(repo.keyExists(key)),
    set: (key: string, value: any) => using(connect(envKey))(repo.set(key, value)),
    remove: (key: string) => using(connect(envKey))(repo.remove(key)),
    clear: () => using(connect(envKey))(repo.clear),
    count: () => using(connect(envKey))(repo.count),
    drop: () => using(connect(envKey))(repo.drop),
  }
};
