import parseAccxUser from "../parseAccxUser";
import { runSession } from "./runSession";
import { REMOVE_USER } from "./constants";

export default async function removeDeviceUser(userId: string) {
  return runSession({
    command: REMOVE_USER,
    params: [userId],
    onData: (onComplete: (result: Boolean) => void, data: string) => {
      const nextUser = parseAccxUser(data);

      onComplete(!!nextUser);
    },
  });
}
