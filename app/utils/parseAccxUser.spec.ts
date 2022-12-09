import parseAccxUser from "./parseAccxUser";

describe("parseAccxUser", () => {
  test.each([
    ["0:0:0  1/1/0 SUN Alarm level changed to 0", undefined],
    ["0:0:0  1/1/0 SUN ", undefined],
    ["0:0:0  1/1/0 SUN User dump started.", undefined],
    [
      "186	255	102 ",
      {
        id: "186",
        userMask: 255,
        tag: "102",
      },
    ],
    [
      "197\t255\t4294967295",
      {
        id: "197",
        userMask: 255,
        tag: "4294967295",
      },
    ],
    [
      "189\t255\t88",
      {
        id: "189",
        userMask: 255,
        tag: "88",
      },
    ],
    ["UserNum: Usermask: TagNum:", undefined],
    ["UserNum: Usermask: TagNum:", undefined],
    ["", undefined],
  ])("accxUser: %s user: %o", (accxUserString, user) => {
    expect(parseAccxUser(accxUserString)).toEqual(user);
  });
});
