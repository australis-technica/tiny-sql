import { join } from "path";
const pkg = require(join(__dirname, "../package.json"))
describe(pkg.name, ()=> {
    it("works", ()=> {
        // ...
    })
});