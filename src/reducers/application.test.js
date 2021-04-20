import reducer from "./application";

describe("reducer", () => {
  it("throws an error with an unsupported type", () => {
    expect(() => reducer({}, { type: "UNSUPPORTED" })).toThrowError(
      /tried to reduce with unsupported action type/i
    );
  });
});
