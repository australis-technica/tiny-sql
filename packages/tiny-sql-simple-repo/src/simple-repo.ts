import byid from "./by-id";
import Remove from "./remove";
import Init from "./init";
import Add from "./add";
import Exists from "./exists";
import FindBy from "./find-by";
import Update from "./update";
import All from "./all";
import { BasicTable } from "./types";
/**
 *
 * @param tabelName @type {string} @description table name
  * @param tableCreationScript @type {string} @description "table creation script"
 */
export default function SimpleRepo<T extends BasicTable>(
    tabelName: string,
    tableCreationScript: string
) {
    const byId = byid<T>(tabelName);
    const add = Add<T>(tabelName);
    const remove = Remove(tabelName);
    const exists = Exists(tabelName);
    const init = Init(tabelName, tableCreationScript);
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
        remove
    };
};