import { join } from "path";
import { getParams, TediousParameter } from "../src";
import { TYPES } from "tedious";
/** */
describe(
  require(join(__dirname, "../package.json")).name + "-get-params",
  () => {
    /** */
    it("maps from object", () => {
      const expected: TediousParameter = {
        name: "x",
        type: TYPES.VarChar,
        value: "x",
      };
      const params = {
        x: "x",
      };
      expect(getParams(params)[0]).toMatchObject(expected);
    });
    /** */
    it("maps from TediousParameter[]", () => {
      const buffer = new Buffer("hello");
      const expected: TediousParameter[] = [
        {
          name: "buffer",
          type: TYPES.VarBinary,
          value: buffer,
          length: "max",
        },
      ];
      expect(
        getParams([
          {
            type: TYPES.VarBinary,
            value: buffer,
            name: "buffer",
            length: "max",
          },
        ]),
      ).toMatchObject(expected);
    });
    it("maps mixed", () => {
      const r = getParams([
        { x: "x" }, // ->  to many
        { type: TYPES.Int, value: 1, name: "number" }, // -> to One
        1,
      ]);
      const x = r.find(p => p.name === "x");
      expect(x.name).toBe("x");
      expect(x.type).toMatchObject(TYPES.VarChar);
      const n = r.find(p => p.name === "number");
      expect(n.name).toBe("number");
      const d = getParams(1)[0];
      expect(d.name).toBe("default");
      expect(d.type).toMatchObject(TYPES.Int);

      const rrr = getParams([
        { name: "number", type: TYPES.Int },
        { name: "answer", type: TYPES.NVarChar },
      ]);
      const [$1st, $2nd] = rrr;
      expect($1st.name).toBe("number");
      expect($2nd.name).toBe("answer");
    });
  },
);
