import { Connection } from "tedious";
import { isFunction } from "util";
export const isConnection = (x: any): x is Connection => {
  return x instanceof Connection || x.name === "Connection" || isFunction(x);
};
