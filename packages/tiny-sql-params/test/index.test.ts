import { join } from "path";
const name = require(join(__dirname, "../package.json")).name;
import { getFields, notNullField, filterKeys, combineFilters, excludeKeys } from "../src";
/** */
describe(name, () => {
  it("works", () => {
    // ...
  });
});


describe(name + "-get-fields", () => {
  it("works", () => {
    const filters = combineFilters(notNullField, excludeKeys());
    expect(getFields({}, filters)).toBe("");
    expect(getFields({ x: undefined }, filters)).toBe("");
    expect(getFields({ x: null }, filters)).toBe("");

  })
})