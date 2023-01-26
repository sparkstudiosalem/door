import createLogger from "./createLogger";
import {
  BAD_CARD_POSITION_MESSAGE as BAD_CARD_POSITION_MESSAGE,
  Card,
} from "./serial/constants";

const log = createLogger(__filename);

export default function parseAccxCard(
  accxCardString: string
): Card | undefined {
  if (accxCardString === BAD_CARD_POSITION_MESSAGE) {
    log.error("Bad card position number");
    return undefined;
  }

  const cardParts = accxCardString.split(/\s+/);

  if (cardParts.length < 3) {
    log.error(
      `Unrecognized ACCX card format ${JSON.stringify(
        accxCardString
      )}; overall format`
    );
    return undefined;
  }

  const [position, permissions, card_number] = cardParts;
  if (!position || !permissions || !card_number) {
    log.error(
      `Unrecognized ACCX card format ${JSON.stringify(
        accxCardString
      )}; missing card_number, permissions, or position`
    );

    return undefined;
  }

  if (position.includes(":")) {
    log.info(`Ignoring id including colon ${position}`);
    return undefined;
  }

  return {
    card_number,
    permissions: parseInt(permissions, 10),
    position,
  };
}
