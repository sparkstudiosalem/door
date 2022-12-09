import { components } from "../../generated/schema/openapi";
import parseAccxUser from "../parseAccxUser";
import { runSession } from "./runSession";
import createLogger from "../createLogger";

const log = createLogger(__filename);

type User = components["schemas"]["User"];

// When a user is removed from the roster the slot is maintained, and the
// tag is set to this default value.
// https://en.wikipedia.org/wiki/4,294,967,295
const UNSET_TAG = "4294967295"; // FFFF_FFFF
const MAX_USERS = 200;

export default async function getDeviceUsers() {
  let users: readonly User[] = [];
  let ignoredUserCount: number = 0;

  return runSession({
    command: "a",
    onData: (onComplete: (users: readonly User[]) => void, data: string) => {
      const nextUser = parseAccxUser(data);

      if (nextUser?.tag === UNSET_TAG) {
        log.info(
          `Ignoring user id: ${nextUser.id} with default tag value 0xFFFF_FFFF ${nextUser.tag}`
        );
        ignoredUserCount += 1;
      }

      if (nextUser) {
        users = [...users, nextUser];
      }

      const usersSum = users.length + ignoredUserCount;

      log.info(
        JSON.stringify({
          nextUser,
          users: users.length,
          ignoredUserCount,
        })
      );

      if (usersSum === MAX_USERS) {
        onComplete(users);
      }
    },
  });
}
