import { components } from "../../generated/schema/openapi";

export const DATE_SHOW = "d" as const;
export const DEVICE_STATUS_SHOW = "9" as const;
export const PRIVILEGED_MODE = "e" as const;
export const USER_REMOVE = "r" as const;
export const USER_SHOW = "s" as const;
export const USER_UPDATE = "m" as const;
export const USERS_SHOW = "a" as const;

export type COMMANDS =
  | typeof DATE_SHOW
  | typeof DEVICE_STATUS_SHOW
  | typeof USER_REMOVE
  | typeof USER_SHOW
  | typeof USER_UPDATE
  | typeof USERS_SHOW;

// When a user is removed from the roster the slot is maintained, and the
// tag is set to this default value.
// https://en.wikipedia.org/wiki/4,294,967,295
export const BLANK_BADGE = "4294967295"; // FFFF_FFFF

export const MAX_USERS = 200;

export const BAD_USER_NUMBER_MESSAGE = "Bad user number!";

export const PRIVILEGED_MODE_PASSWORD = "1234";

export type User = components["schemas"]["User"];
