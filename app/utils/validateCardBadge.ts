import createLogger from "./createLogger";
import { BLANK_BADGE, Card } from "./serial/constants";
const log = createLogger(__filename);

export default function validateCardBadge(card: Card | undefined): boolean {
  if (card?.badge === BLANK_BADGE) {
    log.info(
      `Ignoring card id: ${card.position} with blank badge value 0xFFFF_FFFF ${card.badge}`
    );
    return false;
  }

  return true;
}
