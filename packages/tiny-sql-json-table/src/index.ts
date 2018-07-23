import getValue from "./get-value";
import init from "./init";
import defaults from "./defaults";
import add from "./add" ;
import setValue from "./set-value";
import keyExists from "./key-exists";
import removeKey from "./remove-key";
/** */
export default (tableName: string)=> ({
    add: add(tableName),
    defaults: defaults(tableName),
    getValue: getValue(tableName),
    init: init(tableName),
    keyExists: keyExists(tableName),
    setValue: setValue(tableName),
    removeKey: removeKey(tableName)
});