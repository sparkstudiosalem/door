import { components } from "../../generated/schema/openapi";
import parseAccxUser from "../parseAccxUser";
import { runSession } from "./serial";
import createLogger from "../createLogger";
import { MAX_USERS, SHOW_ALL_USERS, UNSET_TAG } from "./constants";

const log = createLogger(__filename);

type User = components["schemas"]["User"];

export default async function getDeviceUsers() {
  let users: readonly User[] = [];
  let ignoredUserCount: number = 0;

  return runSession({
    command: SHOW_ALL_USERS,
    isPrivileged: true,
    onData: (onComplete: (users: readonly User[]) => void, data: string) => {
      const nextUser = parseAccxUser(data);

      if (nextUser?.tag === UNSET_TAG) {
        log.info(
          `Ignoring user id: ${nextUser.id} with default tag value 0xFFFF_FFFF ${nextUser.tag}`
        );
        ignoredUserCount += 1;
      } else if (nextUser) {
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
