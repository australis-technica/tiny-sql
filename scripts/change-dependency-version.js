const { readFileSync, writeFileSync } = require("fs");
/**
 * 
 * @param {{ name: string, version: string, path: string }} pkg 
 * @param {string} version
 * @param {string} dependencyName
 */
module.exports = (pkg, dependencyName, version) => {
    const { path } = pkg;
    writeFileSync(
      path,
      readFileSync(path, "utf-8").replace(
        new RegExp(`"${dependencyName}":\s+"(.*)"`),
        `"${dependencyName}": "${version}"`
      )
    );
  }