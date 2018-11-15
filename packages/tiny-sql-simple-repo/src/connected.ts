import using from "@australis/tiny-sql-use-connection";
import simpleRepo from "./simple-repo";
import { BasicTable } from "./types";
import connect from "./connect";
export default <T extends BasicTable>(tableName: string, creationScript: string, envKey?: string) => {
    const {
        add,
        all,
        byId,
        exists,
        findBy,
        init,
        remove,
        update
    } = simpleRepo<T>(tableName, creationScript)
    return {
        add: (args:Partial<T>) => using(connect(envKey))(add(args)),
        all: () => using(connect(envKey))(all()),
        byId: (id: string | number) => using(connect(envKey))(byId(id)),
        exists: () => using(connect(envKey))(exists()),
        findBy: (params: Partial<T>) => using(connect(envKey))(findBy(params)),
        init: () => using(connect(envKey))(init()),
        remove: (id: string | number) => using(connect(envKey))(remove(id)),
        update: (p: Partial<T>) => using(connect(envKey))(update(p))
    }
}