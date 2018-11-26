import clear from "@australis/tiny-sql-extra/lib/clear-table";
import count from "@australis/tiny-sql-extra/lib/count-table";
import drop from "@australis/tiny-sql-extra/lib/drop-table";
import exists from "@australis/tiny-sql-extra/lib/table-exists";
import defaults from "./defaults";
import get from "./get";
import init from "./init";
import keyExists from "./key-exists";
import remove from "./remove";
import set from "./set";
/** */
export default (tableName: string) => ({
    tableName,
    defaults: defaults(tableName),
    exists: exists(tableName),
    get: get(tableName),
    init: init(tableName),
    keyExists: keyExists(tableName),
    set: set(tableName),
    remove: remove(tableName),
    clear: clear(tableName),
    count: count(tableName),
    drop: drop(tableName)
});