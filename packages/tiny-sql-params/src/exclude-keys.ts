import { KeyFilter } from "./types";
/**
 * 
 * @param keys 
 */
export default function  excludeKeys<T, TK extends keyof T & string>( ...keys: TK[]): KeyFilter<T, TK> {
    return (key, _)=> {
        return keys.indexOf(key) === -1;
    }
}