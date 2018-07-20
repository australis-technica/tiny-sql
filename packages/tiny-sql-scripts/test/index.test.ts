import { join } from "path";

/** */
describe("scripts", () => {
  it("works", async () => {
    const Scripts = (await import("../src")).default;
    const {
      getScript,
      getScriptPartsSync,
      getScriptParts,
      getScriptSync
    } = Scripts(join(__dirname, "../sql"));
    expect(
      (await getScript("test.sql"))
        .trim()
        .split("\n")
        .join("")
        .split("\r")
        .join("")
    ).toBe(`/*test*/GO/*test*/go/*test*/Go/*test*/gO`);
    expect(
      getScriptSync("test.sql")
        .trim()
        .split("\n")
        .join("")
        .split("\r")
        .join("")
    ).toBe(`/*test*/GO/*test*/go/*test*/Go/*test*/gO`);
    expect(
      (await getScriptParts("test.sql"))[2]
        .split("\n")
        .join("")
        .split("\r")
        .join("")
    ).toBe("/*test*/");
    expect(
      getScriptPartsSync("test.sql")[2]
        .split("\n")
        .join("")
        .split("\r")
        .join("")
    ).toBe("/*test*/");
  });
});
