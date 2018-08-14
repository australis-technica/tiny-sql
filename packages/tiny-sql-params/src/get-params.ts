import { Indexer, TediousParameter } from "./types";
import getType from "./get-type";
import isTediousParamLike from "./is-tedious-param-like";
/**
 * TODO: Accept {} OR { [key: string] : string|number|Date|byte[]|TediousParameter.... OR TediousParameter[]  }
 */
export default function getParams(args: TediousParameter[] | ({}[]) | {}): TediousParameter[] {
    if (Array.isArray(args) && args.length) {
        const value = args[0];
        if (isTediousParamLike(value)) {
            return args as TediousParameter[];
        }
        return toParams(value);
    }
    if (typeof args === "object") return toParams(args);
    return [];
}
/** */
export function getParam<T extends Indexer>(args: T) {
    /** */
    return (key: string): TediousParameter => {
        const value = args[key];
        return {
            name: key,
            value,
            type: getType(value)
        };
    }
}
/**
 * map plain object to TediousParams[]
 */
export function toParams<T extends {} & Indexer>(args: T): TediousParameter[] {
    const keys = Object.keys(args || {});
    return keys.map(getParam(args));
};