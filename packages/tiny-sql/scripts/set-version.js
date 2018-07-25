#! #!/usr/bin/env node
const { join, resolve } = require("path");
const { version } = require(join(__dirname, "../package.json"));
const pkgJsonPath = resolve(__dirname, "../package.json");
const { readFileSync, writeFileSync } = require("fs");
const pkgJson = readFileSync(pkgJsonPath, "utf-8");
const out = pkgJson.replace(/"(@australis\/tiny\-sql\-.*)":\s+?"(.*)"/gi, (...args)=>{
    return `"${args[1]}": "${version}"`;
});
writeFileSync(pkgJsonPath, out);