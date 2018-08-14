import { join } from "path";
import { getParams, TediousParameter } from "../src";
import { TYPES } from "tedious";
/** */
describe(require(join(__dirname, "../package.json")).name + "-get-params", () => {
  /** */
  it("maps from object", () => {    
    const expected: TediousParameter= {
      name: "x",
      type: TYPES.VarChar,
      value: "x",
    };
    const params = {
      x: "x"
    };
    expect(getParams(params)[0]).toMatchObject(expected);
  });
  /** */
  it("maps from TediousParameter[]", () => {
    const buffer = new Buffer("hello");
    const expected: TediousParameter[] = [{
      name: "buffer",
      type: TYPES.VarBinary,
      value: buffer,
      options: {
        length: "max"
      }
    }];
    expect(getParams([{
      type: TYPES.VarBinary, value: buffer, name: "buffer", options: { length: "max" }
    }])).toMatchObject(expected);
  });
});
