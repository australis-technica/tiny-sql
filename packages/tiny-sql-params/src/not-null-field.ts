import isNullOrUndefined from "./is-null-or-undefined";
/**
 * 
 * @param key 
 * @param x 
 */
export default function notNullFields(key: string, x: {}){
    return  !isNullOrUndefined((x as any)[key])
}