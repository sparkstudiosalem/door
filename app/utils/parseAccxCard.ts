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

  const [id, permissions, badge] = cardParts;
  if (!id || !permissions || !badge) {
    log.error(
      `Unrecognized ACCX card format ${JSON.stringify(
        accxCardString
      )}; missing id, permissions, or badge`
    );

    return undefined;
  }

  if (id.includes(":")) {
    log.info(`Ignoring id including colon ${id}`);
    return undefined;
  }

  return {
    id,
    permissions: parseInt(permissions, 10),
    badge,
  };
}
