import { Exec } from "@australis/tiny-sql-exec-sql";
/** */
export default (tableName: string) => {
    /** */
    return (key: string, value: any) => {
        return Exec(`
            if(not(exists(select [key] from [${tableName}] where [key] = @key)))
            insert into ${tableName} ([key], [value]) values (@key, @value);
            else update ${tableName} set [value] = @value WHERE [key] = @key;`,
            { key, value: JSON.stringify(value) }
        );
    }
}