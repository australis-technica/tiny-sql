#!/usr/bin/env node
const { join, resolve } = require("path");
const { workspaces, version } = require("../package.json");
const validVersion = require("./valid-version");
const changeVersion = require("./change-version");
const cwd = process.cwd();
const rootVersion = version;
const args = process.argv.slice(2);
let verbose = args.find(a => /(--verbose|-v)/.test(a));
verbose = typeof verbose === "string";
log = verbose ? console.log.bind(console) : () => {};
/**
 * Start
 */
if (!rootVersion) {
  showUsage();
  process.exit(-1);
}
log("root-version: %s", rootVersion);
if (!validVersion(rootVersion)) {
  log("invalid version '%s' use: \\d+.\\d+.\\d+(-\\d+)?", rootVersion);
  showUsage();
  process.exit(-1);
}
const packages = workspaces.map(x => {
  const path = join(cwd, x, "package.json");
  const { name, version } = require(path);
  return {
    path,
    name,
    version
  };
});
log(packages);
// run
for (const pkg of packages) {
  const { path } = pkg;
  changeVersion(path, rootVersion);
  log("set-version: %s => %s", path, version);
}
changeVersion(resolve("lerna.json"), rootVersion);
log("set-version: %s => %s", "lerna.json", version);
/**
 *
 */
function showUsage() {
  console.log("set new version on ROOT package.json");
}
