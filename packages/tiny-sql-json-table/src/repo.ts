import clear from "./clear";
import defaults from "./defaults";
import exists from "./exists";
import get from "./get";
import init from "./init";
import remove from "./remove";
import set from "./set";
import count from "./count";
/** */
export default (tableName: string) => ({
    tableName,
    defaults: defaults(tableName),
    get: get(tableName),
    init: init(tableName),
    exists: exists(tableName),
    set: set(tableName),
    remove:remove(tableName),
    clear: clear(tableName),
    count: count(tableName)
});