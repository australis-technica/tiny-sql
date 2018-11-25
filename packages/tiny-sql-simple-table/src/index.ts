import ById from "./by-id";
import Remove from "./remove";
import Init from "./init";
import Add from "./add";
import Exists from "./exists";
import FindBy from "./find-by";
import Update from "./update";
import All from "./all";
import { BasicTable } from "./types";
import Drop from "./drop";
export * from "./types";
/**
 *
 * @param tableName @type {string} @description table name
 * @param dto @type {string} @description "create table blah, blah, blah...."
 */
export default function SimpleTable<T extends BasicTable>(
  tableName: string,
  dto: string
) {
  const byId = ById<T>(tableName);
  const add = Add<T>(tableName, byId);
  const remove = Remove(tableName);
  const exists = Exists(tableName);
  const init = Init(tableName, dto, exists);
  const findBy = FindBy<T>(tableName);
  const update = Update<T>(tableName);  
  const all = All<T>(tableName);
  const drop = Drop(tableName)
  /** */
  return {
    tableName,
    add,
    all,
    byId,
    exists,
    findBy,
    init,
    update,
    remove,
    drop,
  };
};