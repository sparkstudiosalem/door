import parseAccxUser from "../parseAccxUser";
import { runSession } from "./serial";
import { User, USER_SHOW } from "./constants";
import validateUserBadge from "../validateUserBadge";

export default async function getDeviceUser(userId: string) {
  return runSession({
    command: USER_SHOW,
    isPrivileged: true,
    params: [userId],
    onEvent: ({
      data,
      onError,
      onComplete,
    }: {
      data: string;
      onError: () => void;
      onComplete: (user: User | undefined) => void;
    }) => {
      const nextUser = parseAccxUser(data);

      if (validateUserBadge(nextUser)) {
        onComplete(nextUser);
      } else {
        onError();
      }
    },
  });
}
