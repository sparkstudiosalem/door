import createLogger from "./createLogger";
import { BLANK_BADGE, User } from "./serial/constants";
const log = createLogger(__filename);

export default function validateUserBadge(user: User | undefined): boolean {
  if (user?.badge === BLANK_BADGE) {
    log.info(
      `Ignoring user id: ${user.id} with blank badge value 0xFFFF_FFFF ${user.badge}`
    );
    return false;
  }

  return true;
}
