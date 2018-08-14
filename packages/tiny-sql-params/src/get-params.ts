import { Indexer, TediousParameter } from "./types";
import getType from "./get-type";
import isTediousParameterLike from "./is-tedious-param-like";
/**
 * TODO: Accept {} OR { [key: string] : string|number|Date|buffer.... OR TediousParameter[]  }
 */
export default function getParams(args: TediousParameter[] | {}): TediousParameter[] {
    if (Array.isArray(args)) {
        if (!args.length) {
            return args;
        }
        for (const value of args) {
            if (!isTediousParameterLike(value)) {
                throw new Error("Arrany must be of TediousParameter");
            }
        }
        return args as TediousParameter[];
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
 * map plain object to TediousParameter[]
 */
export function toParams<T extends {} & Indexer>(args: T): TediousParameter[] {
    const keys = Object.keys(args || {});   
    return keys.map(getParam(args));
};