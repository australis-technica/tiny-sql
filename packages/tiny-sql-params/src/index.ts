import { TYPES, TediousType, ParameterOptions } from "tedious";
import { isNullOrUndefined } from "util";

export type TediousParams = {
  name: string;
  type: TediousType;
  value: any;
  options?: ParameterOptions;
};

export interface Indexer {
  [key: string]: any;
}

const getType = (value: any): TediousType => {
  if (isNullOrUndefined(value)) return value;
  switch (typeof value) {
    case "string":
      return TYPES.VarChar;
    case "number":
      return /\.|,/.test(`${value}`) ? TYPES.Float : TYPES.Int;
    case "boolean":
      return TYPES.Bit;
    default: {
      if (value instanceof Buffer) {
        return TYPES.Binary
      }
    }
  }
  if (value instanceof Date) return TYPES.DateTime;
  throw new Error(`${typeof value} map Not Implemented`);
};

/**
 * map plain object to TediousParams[]
 */
export const getParams = <T extends {} & Indexer>(args: T): TediousParams[] => {
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

export function isTediousParamLike(x: any): x is TediousParams {
  return x && x.name && x.value && x.type && x.type.type && x.type.name
}