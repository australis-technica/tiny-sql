import ById from "./by-id";
import Remove from "./remove";
import Init from "./init";
import Add from "./add";
import Exists from "./exists";
import FindBy from "./find-by";
import Update from "./update";
import All from "./all";
import { BasicTable } from "./types";
export * from "./types";
/**
 *
 * @param TABLE_NAME @type {string} @description table name
 * @param dto @type {string} @description "create table blah, blah, blah...."
 */
export default function SimpleTable<T extends BasicTable>(
  TABLE_NAME: string,
  dto: string
) {
  const byId = ById<T>(TABLE_NAME);
  const add = Add<T>(TABLE_NAME, byId);
  const remove = Remove(TABLE_NAME);
  const exists = Exists(TABLE_NAME);
  const init = Init(TABLE_NAME, dto, exists);
  const findBy = FindBy<T>(TABLE_NAME);
  const update = Update<T>(TABLE_NAME);  
  const all = All<T>(TABLE_NAME);
  /** */
  return {
    add,
    all,
    byId,
    exists,
    findBy,
    init,
    update,
    remove
  };
};