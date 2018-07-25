import { KeyFilter } from "./types";
/** */
export interface Indexer { [key: string]: any };
/** */
export default function filtterKeys<T extends Indexer, TK extends keyof T & string>(current: T, filter: KeyFilter<T, TK>): Partial<T> {
    return Object.keys(current)
        .filter(key => filter(key as TK, current))
        .reduce((out, key) => {
            out[key] = current[key]; return out;
        }, {} as T);
}