import { debugModule } from "@australis/create-debug";
import isFunction from "./is-function";
import { KeyFilter } from "./types";
const debug = debugModule(module);
/**
 * 
 */
export default function getFields<T extends { [key: string]: any }, TK extends keyof TK & string>(item: T, exclude?: ((keyof T)[]) | KeyFilter<T, TK>): string {
  exclude = exclude || [];
  const keys = Object.keys(item).filter(
    key => !exclude || (!isFunction(exclude) ? exclude.indexOf(key as keyof T) === -1 : exclude(key as TK, item))
  );
  let fields = keys.map(key => `${key} = @${key}`).join(",");
  debug("fields: %s", fields);
  return fields;
}
