import parseAccxUser from "../parseAccxUser";
import { runSession } from "./serial";
import { USER_UPDATE } from "./constants";
import getDeviceUser from "./getDeviceUser";

export default async function updateDeviceUser(
  userId: string,
  currentBadge: string,
  badge: string,
  userMask: number
) {
  const currentUser = await getDeviceUser(userId);

  if (!currentUser || currentUser.badge !== currentBadge) {
    return Promise.reject();
  }

  return runSession({
    command: USER_UPDATE,
    isPrivileged: true,
    params: [userId, userMask, badge],
    onEvent: ({
      data,
      onComplete,
      onError,
    }: {
      onError: () => void;
      onComplete: (isSuccessful: boolean) => void;
      data: string;
    }) => {
      const nextUser = parseAccxUser(data);

      if (nextUser) {
        onComplete(true);
      } else {
        onError();
      }
    },
  });
}
