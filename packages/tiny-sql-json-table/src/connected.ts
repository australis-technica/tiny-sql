import get from "./get";
import init from "./init";
import defaults from "./defaults";
import set from "./set";
import exists from "./exists";
import remove from "./remove";
import clear from "./clear";
import connect from "./connect";
import { useConnection as using } from "@australis/tiny-sql-connect";
import count from "./count";
import drop from "./drop";
/** */
export default (tableName: string, envKey = "DB") => ({
  tableName,
  defaults: (x: {}) => using(connect(envKey))(defaults(tableName)(x)),
  get: (key: string) => using(connect(envKey))(get(tableName)(key)),
  init: () => using(connect(envKey))(init(tableName)),
  exists: (key: string) => using(connect(envKey))(exists(tableName)(key)),
  set: (key: string, value: any) =>
    using(connect(envKey))(set(tableName)(key, value)),
  remove: (key: string) => using(connect(envKey))(remove(tableName)(key)),
  clear: () => using(connect(envKey))(clear(tableName)),
  count: () => using(connect(envKey))(count(tableName)),
  drop: () => using(connect(envKey))(drop(tableName)),
});
