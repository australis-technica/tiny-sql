#!/usr/bin/env node

const runCmd = require("./run-cmd");
const { resolve, join } = require("path");
const args = require("minimist")(process.argv.slice(2));
const task = args._[0];
const cwd = resolve(__dirname, "../");
const log = console.log.bind(console);
/**
 * @type {{workspaces: string[]}}
 */
const pkg = require(join(cwd, "package.json"));
const { workspaces } = pkg;
const yarns = ["add", "remove", "pack"];
const isYarn = (task)=> yarns.indexOf(task) !== -1;
/** */
async function run() {
  for (const ws of workspaces) {
    let wsPkg;
    try {
      /** @type {{ name: string , scripts: { [[key: string]: string]}}} */
      wsPkg = require(resolve(cwd, ws, "package.json"));
      if (
        isYarn(task) ||
        (wsPkg.scripts && task in wsPkg.scripts)
      ) {
        log("Package: %s", wsPkg.name);
        const cmd = ["yarn", "workspace", wsPkg.name, task];
        log("cmd: %s", cmd.join(" "));
        await runCmd(cmd[0], cmd.slice(1));
      }
    } catch (error) {
      log("%s error: \n", (wsPkg && wsPkg.name) || "?", error);
      process.exit(-1);
    }
  }
  log("Done!");
}
console.log("Task: %s", task);
run();
