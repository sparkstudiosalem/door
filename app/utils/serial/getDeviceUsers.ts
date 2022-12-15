import parseAccxUser from "../parseAccxUser";
import { runSession } from "./serial";
import createLogger from "../createLogger";
import { MAX_USERS, User, USERS_SHOW } from "./constants";
import validateUserBadge from "../validateUserBadge";
import { isUser } from "../isUser";

const log = createLogger(__filename);

export default async function getDeviceUsers() {
  let users: readonly User[] = [];
  let ignoredUserCount: number = 0;

  return runSession({
    command: USERS_SHOW,
    isPrivileged: true,
    onEvent: ({
      data,
      onComplete,
    }: {
      data: string;
      onComplete: (users: readonly User[]) => void;
    }) => {
      const nextUser = parseAccxUser(data);

      if (isUser(nextUser) && validateUserBadge(nextUser)) {
        users = [...users, nextUser];
      } else {
        ignoredUserCount += 1;
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
