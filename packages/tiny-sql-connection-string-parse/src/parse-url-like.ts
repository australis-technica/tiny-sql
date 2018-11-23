import { ConnectionConfig } from "tedious";

const PROTOCOL = /(mssql|tedious|sql):\/\/.*/i;

export function urlLike(s: string) {
  return PROTOCOL.test(s);
}
/**
 * Parse dsn/url like connection string
 * @param {string} "Url Like connection string"
 * @example 
 *  mssql|tedious|sql://username:password@hostname\instance/databasename?encrypt=true
 */
export default function parseUrlLike(s: string): ConnectionConfig {
  const { host, pathname, username, password, port, searchParams, } = new URL(
    s.replace(/\\/, "%5C") // URL can't parse back slash
  );

  return {
    server: host && host
      .replace("%5C", "\\") // URL couldn't parse back slash
      .replace(/:\d+/, ""), // because we trick it, didn't remove the port from host
    userName: username,
    password,
    options: {
      port: Number(port),
      database: pathname && pathname.replace("/", ""),
      encrypt: Boolean(searchParams.get("encrypt"))
    }
  };
}