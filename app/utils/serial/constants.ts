import { components } from "../../generated/schema/openapi";

export const DATE_SHOW = "d" as const;
export const DEVICE_STATUS_SHOW = "9" as const;
export const PRIVILEGED_MODE = "e" as const;
export const CARD_REMOVE = "r" as const;
export const CARD_SHOW = "s" as const;
export const CARD_UPDATE = "m" as const;
export const CARDS_SHOW = "a" as const;

export type COMMANDS =
  | typeof DATE_SHOW
  | typeof DEVICE_STATUS_SHOW
  | typeof CARD_REMOVE
  | typeof CARD_SHOW
  | typeof CARD_UPDATE
  | typeof CARDS_SHOW;

// When a user is removed from the roster the slot is maintained, and the
// tag is set to this default value.
// https://en.wikipedia.org/wiki/4,294,967,295
export const BLANK_BADGE = "4294967295"; // FFFF_FFFF

export const MAX_CARDS = 200;

export const BAD_CARD_POSITION_MESSAGE = "Bad card number!";

export const PRIVILEGED_MODE_PASSWORD = "1234";

export type Card = components["schemas"]["Card"];
