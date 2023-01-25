import parseAccxCard from "./parseAccxCard";

describe("parseAccxCard", () => {
  test.each([
    ["0:0:0  1/1/0 SUN Alarm level changed to 0", undefined],
    ["0:0:0  1/1/0 SUN ", undefined],
    ["0:0:0  1/1/0 SUN User dump started.", undefined],
    [
      "186	255	102 ",
      {
        id: "186",
        permissions: 255,
        badge: "102",
      },
    ],
    [
      "197\t255\t4294967295",
      {
        id: "197",
        permissions: 255,
        badge: "4294967295",
      },
    ],
    [
      "189\t255\t88",
      {
        id: "189",
        permissions: 255,
        badge: "88",
      },
    ],
    ["UserNum: Usermask: TagNum:", undefined],
    ["", undefined],
    ["Bad card number!", undefined],
  ])("accxUser: %s card: %o", (accCardString, card) => {
    expect(parseAccxCard(accCardString)).toEqual(card);
  });
});
