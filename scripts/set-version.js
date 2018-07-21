#!/usr/bin/env node
const { join, resolve } = require("path");
const { workspaces, version } = require("../package.json");
const { readFileSync, writeFileSync } = require("fs");
const cwd = process.cwd();
const rootVersion = version;
/**
 * Start
 */
if (!rootVersion) {
  showUsage();
  process.exit(-1);
}
// console.log("root-version: %s", rootVersion);
if (!validVersion(rootVersion)) {
  console.log("invalid version '%s' use: \\d+.\\d+.\\d+(-\\d+)?", rootVersion);
  showUsage();
  process.exit(-1);
}
const packages = workspaces.map(x => {
  const path = join(process.cwd(), x, "package.json");
  const { name, version } = require(path);
  return {
    path,
    name,
    version
  };
});
// console.log(packages);
// run
for (const pkg of packages) {
  const { path } = pkg;
  changeVersion(path, rootVersion);
}
changeVersion(resolve("lerna.json"), rootVersion);
/**
 *
 * @param {string} path
 * @param {string} version
 */
function changeVersion(path, version) {
  writeFileSync(
    path,
    readFileSync(path, "utf-8").replace(
      /"version":\s+"(.*)"/,
      `"version": "${version}"`
    )
  );
}
/**
 * 
 */
function showUsage() {
  console.log("set new version on ROOT package.json");
}
/**
 *
 * @param {string} version
 */
function validVersion(version) {
  // source: https://github.com/sindresorhus/semver-regex
  return /\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?\b/gi.test(
    version
  );
}