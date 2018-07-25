import { KeyFilter } from "./types";
/**
 * 
 * @param filters 
 */
export default function combineFilters<T, TK extends keyof T & string>(...filters: KeyFilter<T, TK>[]): KeyFilter<T, TK> {
    /** */
    return (key, item) => {
        for (const filter of filters) {
            if (!filter(key, item)) {
                return false;
            }
        }
        return true;
    }
}