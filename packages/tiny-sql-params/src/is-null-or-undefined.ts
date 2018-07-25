/**
 * 
 * @param x 
 */
export default function isNullOrUndefined(x: any) {
    return typeof x === "undefined" || x === null;
}