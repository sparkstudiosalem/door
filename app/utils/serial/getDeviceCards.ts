import parseAccxCard from "../parseAccxCard";
import { runSession } from "./serial";
import createLogger from "../createLogger";
import { MAX_CARDS, Card, CARDS_SHOW } from "./constants";
import validateCard from "../validateCard";
import { isCard } from "../isCard";

const log = createLogger(__filename);

export default async function getDeviceCards() {
  let cards: readonly Card[] = [];
  let ignoredCardCount: number = 0;

  return runSession({
    command: CARDS_SHOW,
    isPrivileged: true,
    onEvent: ({
      data,
      onComplete,
    }: {
      data: string;
      onComplete: (cards: readonly Card[]) => void;
    }) => {
      const nextCard = parseAccxCard(data);

      if (isCard(nextCard) && validateCard(nextCard)) {
        cards = [...cards, nextCard];
      } else {
        ignoredCardCount += 1;
      }

      const cardsSum = cards.length + ignoredCardCount;

      log.info(
        JSON.stringify({
          nextCard,
          cards: cards.length,
          ignoredCardCount,
        })
      );

      if (cardsSum === MAX_CARDS) {
        onComplete(cards);
      }
    },
  });
}
