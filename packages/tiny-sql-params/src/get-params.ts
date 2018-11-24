import { Indexer, TediousParameter } from "./types";
import getType from "./get-type";
import isTediousParameterLike from "./is-tedious-param-like";
/**
 * TODO: Accept {} OR { [key: string] : string|number|Date|buffer.... OR TediousParameter[]  }
 */
export default function getParams(
  args: TediousParameter | TediousParameter[] | {} | null | undefined,
): TediousParameter[] {
  if (!args) return [];
  let i = 0;
  if (Array.isArray(args)) {
    let ret: TediousParameter[] = [];
    for (const value of args) {
      if (isTediousParameterLike(value)) {
        ret.push(value);
      } else if (typeof value === "object") {
        ret.push(...toParams(value));
      } else {
        ret.push({
          name: `${i}`,
          type: getType(value),
          value,
        });
      }
      i = i + 1;
    }
    return ret;
  }
  if (isTediousParameterLike(args)) return [args];
  if (typeof args === "object") return toParams(args);
  // Primitives
  return [
    {
      value: args,
      type: getType(args),
      name: "default",
    },
  ];
}
/** */
export function getParam<T extends Indexer>(args: T) {
  /** */
  return (key: string): TediousParameter => {
    const value = args[key];
    return {
      name: key,
      value,
      type: getType(value),
    };
  };
}
/**
 * map plain object to TediousParameter[]
 */
export function toParams<T extends {} & Indexer>(args: T): TediousParameter[] {
  const keys = Object.keys(args || {});
  return keys.map(getParam(args));
}
