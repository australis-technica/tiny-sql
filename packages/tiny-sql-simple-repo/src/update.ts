import { Connection } from "tedious";
import Exec from "@australis/tiny-sql-exec-sql";
import { debugModule } from "@australis/create-debug";
import {
  combineFilters,
  excludeKeys,
  filterKeys,
  getFields,
  notNullField,
} from "@australis/tiny-sql-params";
import { BasicTable } from "./types";

const debug = debugModule(module);
/** */
export default <T extends Partial<BasicTable>>(TABLE_NAME: string) => {
  type TK = keyof T & string;
  /** */
  return (item: Partial<T>) => async (connection: Connection): Promise<T> => {
    if (!item.id) return Promise.reject(new Error("id required!"));
    if (!item)
      return Promise.reject(
        new Error(`@param ${TABLE_NAME}: ${TABLE_NAME} required`),
      );
    try {
      /** */
      const current = await Exec<T>(
        `select top 1 * from ${TABLE_NAME} where id = @id`,
        { id: item.id },
      )(connection).then(x => x.values[0]);
      if (!current || !current.id) {
        return Promise.reject(new Error(`${TABLE_NAME} Not Found`));
      }
      //
      const fields = getFields(item, notNullField);
      if (!fields || !fields.length) {
        return Promise.reject(`Nothing to update`);
      }
      const exclude = excludeKeys<T, TK>("createdAt");
      /**
       * remove null, undefined & forbidden fields
       *  */
      const params = Object.assign(
        filterKeys(current, combineFilters<T, TK>(notNullField, exclude)),
        item,
      );
      const r = await Exec<T>(
        `
                update ${TABLE_NAME} 
                set 
                    ${fields}
                , updatedAt = GETDATE()
                where id = @id
            `,
        params,
      )(connection);
      const { id } = item;
      const result = await Exec<T>(
        `select top 1 * from ${TABLE_NAME} where id = @id`,
        { id },
      )(connection);
      return Promise.resolve(result.values[0]);
    } catch (error) {
      debug(error);
      return Promise.reject(error);
    }
  };
};
