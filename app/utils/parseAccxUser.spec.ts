import parseAccxUser from "./parseAccxUser";

describe("parseAccxUser", () => {
  test.each([
    [
      "186	255	4294967295 \r",
      {
        id: "186",
        userMask: 255,
        tag: "4294967295",
      },
    ],
  ])("accxUser: %s user: %o", (accxUserString, user) => {
    expect(parseAccxUser(accxUserString)).toEqual(user);
  });
});
