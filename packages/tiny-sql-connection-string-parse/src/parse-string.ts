import { ConnectionConfig } from "tedious";
import { debugModule } from "@australis/create-debug";
import parseSqlClientLike from "./parse-sql-client-like";
import parseUrlLike, { urlLike } from "./parse-url-like";
const debug = debugModule(module);
/** */
export default function parseString(
  connectionString: string,
): ConnectionConfig {
  if (!connectionString) return {
    options: {
      //empty
    }
  };
  try {
    if (urlLike(connectionString)) {
      return parseUrlLike(connectionString);
    }
    return parseSqlClientLike(connectionString);
  } catch (error) {
    debug("can't parse connection-string: %s", error.message);
    throw error;
  }
}

