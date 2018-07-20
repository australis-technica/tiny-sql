import * as fs from "fs";
import { join, isAbsolute } from "path";
import { debugModule } from "@australis/create-debug";
const debug  = debugModule(module);
/** */
export default (scriptsHome: string) => {
  /** */
  const getPath = (name: string): string => {
    const home = scriptsHome
      ? isAbsolute(scriptsHome)
        ? scriptsHome
        : join(process.cwd(), scriptsHome)
      : process.cwd();
    const ret = isAbsolute(name) ? name : join(home, name);
    debug("get-path: %s", ret);
    return ret;
  };
  /** */
  function getScriptSync(name: string): string {
    return fs.readFileSync(getPath(name), "utf-8");
  }
  /** */
  function getScript(name: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(getPath(name), "utf-8", (error, data) => {
        if (error) {
          debug(error);
          return reject(error);
        }
        resolve(data);
      });
    });
  }
  /** */
  function getScriptPartsSync(name: string): string[] {
    return fs.readFileSync(getPath(name), "utf-8").split(/go/gi);
  }
  /** */
  function getScriptParts(name: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(getPath(name), "utf-8", (err, text) => {
        if (err) return reject(err);
        try {
          return resolve(
            text
              .split(/go/gi)
              // not empty
              .filter(x => typeof x === "string" && x.trim() !== "")
          );
        } catch (error) {
          debug(error);
          return reject(error);
        }
      });
    });
  }
  return {
    getScript,
    getScriptParts,
    getScriptPartsSync,
    getScriptSync
  };
};
