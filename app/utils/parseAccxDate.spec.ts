import parseAccxDate from "./parseAccxDate";

describe("parseAccxDate", () => {
  test.each([
    ["0:0:0  1/1/0 SUN \r", "2000-01-01T00:00:00.000Z"],
    ["0:0:0  1/1/0 SUN ", "2000-01-01T00:00:00.000Z"],
  ])("accxDate: %s date: %o", (accxDate, dateString) => {
    expect(parseAccxDate(accxDate).toISOString()).toBe(dateString);
  });
});
