import { ConnectionConfig } from "tedious";

/**
 * Parse a subset of a .Net framework/SqlClient like connection string
 * & extra keywords
 *  as ';' separated key=value entries
 * sample 'Data Source=(local);Initial Catalog=DBNAME;user=userName;password=password;'
 * */
export default function parseSqlClientLike(connectionString: string): ConnectionConfig {

    if (connectionString.indexOf("Integrated Security") !== -1) {
        throw new Error("Integrated Security is Not Implemented");
    }

    function find(keyToFind: string | RegExp) {
        if (typeof keyToFind === "string")
            /** */
            return (key: string) => key && key.toLowerCase().trim() === keyToFind.toLowerCase();
        return (key: string) => keyToFind.test(key);
    }
    const config = connectionString
        .split(";")
        .filter(x => x && typeof x === "string" && x.trim() !== "")
        .reduce((out, next) => {
            const parts = next.split("=");
            return Object.assign(out, { [parts[0]]: parts[1] });
        }, {} as {
            [key: string]: string;
        });
    const keys = Object.keys(config);
    let server = config[keys.find(find(/(data(\s+)?source|server)/i))];
    const port = Number(server && server.split(/,|:/)[1]);
    server = server && server.split(/,|:/)[0];
    server = server && server.replace(/(\.|\(local\))/i, "localhost");
    const database = config[keys.find(find(/(initial(\s+)?catalog|database)/i))];
    const userName = config[keys.find(find(/(user|user\s+id)/i))];
    const password = config[keys.find(find(/(password)/i))];
    // non standard?
    const encrypt = Boolean(config.encrypt);
    return {
        server,
        userName,
        password,
        options: {
            port,
            database,
            encrypt,
        }
    };
}