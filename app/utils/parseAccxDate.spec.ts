import parseAccxDate from "./parseAccxDate";

describe("parseAccxDate", () => {
  test.each([["0:0:0  1/1/0 SUN", new Date("2000-01-01T00:00:00.000Z")]])(
    "accxDate: %s date: %o",
    (accxDate, date) => {
      expect(parseAccxDate(accxDate)).toEqual(date);
    }
  );
});
