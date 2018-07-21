#!/usr/bin/env node

const { writeFileSync, readFileSync, existsSync } = require("fs");
const { resolve } = require("path");
const args = process.argv.slice(2);

const packagePath = (args.find(x=> /--package=.*/.test(x))||"").split("=")[1] || "./package.json";
if(!packagePath) {
    console.log("usage: set-private  --private='true|false' --package='...packagesPath'");
    process.exit(-1);
}
const p = resolve(packagePath);
if(!existsSync(p)) {
    console.log("package: %s NOT FOUND", p);
    process.exit(-1);
}

const value = (args.find(x=> /--value=\w+/.test(x)) || "").split("=")[1];
// console.log("value: %s", value);
if(["true", "false"].indexOf(value) === -1){
    console.log("usage: set-private  --private='true|false'");
    process.exit(-1);
} 

writeFileSync(p, readFileSync(p, "utf-8").replace(/"private":\s+(\w+)/, `"private": ${value}`));