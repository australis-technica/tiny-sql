import _connect, { useConnection as using } from "@australis/tiny-sql-connect";
import connectionConfig from "@australis/tiny-sql-connection-config";
import simpleRepo from "./simple-repo";
import { BasicTable } from "./types";
/** */
export default <T extends BasicTable>(tableName: string, setupScript: string, envKey?: string) => {

    const {
        add,
        all,
        byId,
        exists,
        findBy,
        init,
        remove,
        update,
        clear,
        drop
    } = simpleRepo<T>(tableName, setupScript)

    const connect = () => _connect(connectionConfig(envKey));

    return {
        add: (args: Partial<T>) => using(connect)(add(args)),
        all: () => using(connect)(all()),
        byId: (id: string | number) => using(connect)(byId(id)),
        exists: () => using(connect)(exists),
        findBy: (params: Partial<T>) => using(connect)(findBy(params)),
        init: () => using(connect)(init()),
        remove: (id: string | number) => using(connect)(remove(id)),
        update: (p: Partial<T>) => using(connect)(update(p)),
        clear: () => using(connect)(clear),
        drop: () => using(connect)(drop)
    }
}