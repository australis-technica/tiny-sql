import Add from "./add";
import All from "./all";
import byid from "./by-id";
import Clear from "./clear";
import Drop from "./drop";
import Exists from "./exists";
import FindBy from "./find-by";
import Init from "./init";
import Remove from "./remove";
import { BasicTable } from "./types";
import Update from "./update";
/**
 *
 * @param tabelName @type {string} @description table name
  * @param setupScript @type {string} 
 */
export default function SimpleRepo<T extends BasicTable>(
    tabelName: string,
    setupScript: string
) {
    const byId = byid<T>(tabelName);
    const add = Add<T>(tabelName);
    const remove = Remove(tabelName);
    const exists = Exists(tabelName);
    const init = Init(tabelName, setupScript);
    const findBy = FindBy<T>(tabelName);
    const update = Update<T>(tabelName);
    const all = All<T>(tabelName);
    /** */
    return {
        add,
        all,
        byId,
        exists,
        findBy,
        init,
        update,
        remove,
        drop: Drop(tabelName),
        clear: Clear(tabelName)
    };
};