import { Indexer, TediousParams } from "./types";
import getType from "./get-type";
/**
 * map plain object to TediousParams[]
 */
export default function getParams<T extends {} & Indexer>(args: T): TediousParams[] {
    const keys = Object.keys(args || {});
    return keys.map(key => {
        const value = args[key];
        return {
            name: key,
            value,
            type: getType(value)
        };
    });
};