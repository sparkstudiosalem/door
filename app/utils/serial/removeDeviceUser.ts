import parseAccxUser from "../parseAccxUser";
import { runSession } from "./serial";
import { USER_REMOVE } from "./constants";

export default async function removeDeviceUser(userId: string) {
  return runSession({
    command: USER_REMOVE,
    isPrivileged: true,
    params: [userId],
    onEvent: ({
      data,
      onComplete,
    }: {
      data: string;
      onComplete: (result: Boolean) => void;
    }) => {
      const nextUser = parseAccxUser(data);

      onComplete(!!nextUser);
    },
  });
}
