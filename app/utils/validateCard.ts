import createLogger from "./createLogger";
import { BLANK_CARD_NUMBER, Card } from "./serial/constants";
const log = createLogger(__filename);

export default function validateCard(card: Card | undefined): boolean {
  if (card?.card_number === BLANK_CARD_NUMBER) {
    log.info(
      `Ignoring card id: ${card.position} with blank badge value 0xFFFF_FFFF ${card.card_number}`
    );
    return false;
  }

  return true;
}
