export const REMOVE_USER = "r" as const;
export const SHOW_ALL_USERS = "a" as const;
export const SHOW_DEVICE_STATUS = "9" as const;
export const SHOW_DATE = "d" as const;
export const SHOW_USER = "s" as const;
export const PRIVILEGED_MODE = "e" as const;

export type COMMANDS =
  | typeof REMOVE_USER
  | typeof SHOW_ALL_USERS
  | typeof SHOW_DATE
  | typeof SHOW_DEVICE_STATUS
  | typeof SHOW_USER;

// When a user is removed from the roster the slot is maintained, and the
// tag is set to this default value.
// https://en.wikipedia.org/wiki/4,294,967,295
export const UNSET_TAG = "4294967295"; // FFFF_FFFF

export const MAX_USERS = 200;

export const BAD_USER_NUMBER_MESSAGE = "Bad user number!";

export const PRIVILEGED_MODE_PASSWORD = "1234";
