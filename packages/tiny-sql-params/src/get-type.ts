import { TediousType, TYPES } from "tedious";
import { isNullOrUndefined } from "util";
/** */
export default function getType(value: any): TediousType {
  if (isNullOrUndefined(value))
    throw new Error("Cant get types from null|undefined");
  const type = typeof value;
  if (type === "string") {
      if(value.startsWith("<")) return TYPES.Xml;
      return TYPES.VarChar
  };
  if (type === "number")
    return /\.|,/.test(`${value}`) ? TYPES.Float : TYPES.Int;
  if (type === "boolean") return TYPES.Bit;  
  if (value instanceof Buffer) return TYPES.Binary;
  if (value instanceof Date) return TYPES.DateTime;
  return value;
}
