import { components } from "../../generated/schema/openapi";
import parseAccxUser from "../parseAccxUser";
import { runSession } from "./serial";
import createLogger from "../createLogger";
import { SHOW_USER, UNSET_TAG } from "./constants";

const log = createLogger(__filename);

type User = components["schemas"]["User"];

export default async function getDeviceUser(userId: string) {
  return runSession({
    command: SHOW_USER,
    isPrivileged: true,
    params: [userId],
    onData: (onComplete: (user: User | undefined) => void, data: string) => {
      const nextUser = parseAccxUser(data);

      if (nextUser?.tag === UNSET_TAG) {
        log.info(
          `Ignoring user id: ${nextUser.id} with default tag value 0xFFFF_FFFF ${nextUser.tag}`
        );
        onComplete(undefined);
      } else if (nextUser) {
        onComplete(nextUser);
      }
    },
  });
}
