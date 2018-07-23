import { Connection } from "tedious";
import ExecSql from "@australis/tiny-sql-exec-sql";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/**
 *
 */
export interface BasicTable {
  id: string | number;
  updatedAt: number;
  createdAt: number;
}
/**
 *
 * @param TABLE_NAME @type {string} @description table name
 * @param dto @type {string} @description "create table blah, blah, blah...."
 */
export default function SimpleTable<T extends BasicTable>(
  TABLE_NAME: string,
  dto: string
) {
  async function add(
    connection: Connection,
    item: Partial<T> & { id: string; displayName: string }
  ): Promise<T> {
    try {
      const execSql = ExecSql(connection);
      const sql = `
        insert into ${TABLE_NAME}         
        (${Object.keys(item)
          // .filter(key => key !== "id")
          .join(",")}) 
        values 
        (${Object.keys(item)
          // .filter(key => key !== "id")
          .map(key => `@${key}`)
          .join(",")}) 
        `;
      debug(sql);
      await execSql<T>(sql, item);
      return byId(connection, item.id);
    } catch (error) {
      debug(error);
      throw error;
    }
  }
  /** */
  async function all(connection: Connection) {
    try {
      const execSql = ExecSql(connection);
      const result = await execSql<T>(`
        select * from ${TABLE_NAME}
        `).then(x => x.values);
      return result;
    } catch (error) {
      debug(error);
      throw error;
    }
  }
  /** */
  async function byId(connection: Connection, id: string): Promise<T> {
    try {
      const execSql = ExecSql(connection);
      const result = await execSql<T>(
        `
        select top 1 * from ${TABLE_NAME} where id = @id
        `,
        { id }
      );
      return Promise.resolve(result.values[0]);
    } catch (error) {
      debug(error);
      throw error;
    }
  }
  /** */
  function getFields<TF>(item: TF, ...exclude: (keyof TF)[]): string {
    exclude = exclude || [];
    const keys = Object.keys(item).filter(
      key => exclude.indexOf(key as keyof TF) === -1
    );
    let fields = keys.map(key => `${key} = @${key}`).join(",");
    return fields;
  }
  /** */
  async function findBy(
    connection: Connection,
    params: Partial<T>
  ): Promise<T[]> {
    try {
      const execSql = ExecSql(connection);
      const query = `/*find-by*/
select * from ${TABLE_NAME} 
  where ${Object.keys(params)
    .map(key => ` ${key} = @${key}`)
    .join(" AND ")};
/*find-by*/`;
      debug(query);
      const r = await execSql<T>(query, params);
      if (r.error) {
        return Promise.reject(r.error);
      }
      return Promise.resolve(r.values);
    } catch (error) {
      debug(error);
      throw error;
    }
  }

  async function init(connection: Connection) {
    try {
      const execSql = ExecSql(connection);
      await execSql(dto);
      return execSql<{ ok: number }>(
        `select ok=1 from sys.tables where name = '${TABLE_NAME}'`
      ).then(x => x.values[0]["ok"] === 1);
    } catch (error) {
      debug(error);
      throw error;
    }
  }

  async function update(
    connection: Connection,
    item: Partial<T> & { id: string }
  ): Promise<T> {
    if (!item)
      return Promise.reject(
        new Error(`@param ${TABLE_NAME}: ${TABLE_NAME} required`)
      );
    try {
      const execSql = ExecSql(connection);
      /** */
      const current = await execSql<T>(
        `select top 1 * from ${TABLE_NAME} where id = @id`,
        { id: item.id }
      ).then(x => x.values[0]);
      if (!current || !current.id) {
        return Promise.reject(new Error(`${TABLE_NAME} Not Found`));
      }
      const fields = getFields(item);
      if (!fields || !fields.length) {
        return Promise.reject(`Nothing to update`);
      }
      /** */
      const r = await execSql<T>(
        `
            update ${TABLE_NAME} 
            set 
                ${fields}
            , updatedAt = GETDATE()
            where id = @id
        `,
        Object.assign(current, item)
      );
      if (r.error) {
        return Promise.reject(r.error);
      }
      // if(r.affected === ) { return Promise.reject(r.error); }
      // if(r.status === ) { return Promise.reject(r.error); }
      return byId(connection, item.id);
    } catch (error) {
      debug(error);
      return Promise.reject(error);
    }
  }
  /** */
  async function remove(connection: Connection, id: string | number) {
    try {
      const r = await ExecSql(connection)(`DELETE ${TABLE_NAME} where id = @id`, { id });
      if (r.error) return Promise.reject(r.error);
      return Promise.resolve(r);
    } catch (error) {
      debug(error);
      return Promise.reject(error);
    }
  }
/** */
  return {
    add,
    all,
    byId,
    findBy,
    init,
    update,
    remove
  };
}
