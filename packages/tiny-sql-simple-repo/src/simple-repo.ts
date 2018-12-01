import Clear from "@australis/tiny-sql-extra/lib/clear-table";
import Drop from "@australis/tiny-sql-extra/lib/drop-table";
import All from "@australis/tiny-sql-extra/lib/select-star";
import exists from "@australis/tiny-sql-extra/lib/table-exists";
import Add from "./add";
import byid from "./by-id";
import FindBy from "./find-by";
import Init from "./init";
import Remove from "./remove";
import { BasicTable } from "./types";
import Update from "./update";
/**
 *
 * @param tabelName @type {string} @description table name
  * @param scripts @type {string} 
 */
export default function SimpleRepo<T extends BasicTable>(
    tabelName: string,
    scripts: string|string[]
) {
    const byId = byid<T>(tabelName);
    const add = Add<T>(tabelName);
    const remove = Remove(tabelName);
    const init = Init(tabelName, scripts);
    const findBy = FindBy<T>(tabelName);
    const update = Update<T>(tabelName);
    const all = All<T>(tabelName);
    /** */
    return {
        add,
        all,
        byId,
        exists: exists(tabelName),
        findBy,
        init,
        update,
        remove,
        drop: Drop(tabelName),
        clear: Clear(tabelName)
    };
};