import parseAccxCard from "../parseAccxCard";
import { runSession } from "./serial";
import { Card, CARD_SHOW } from "./constants";
import validateCard from "../validateCard";

export default async function getDeviceCard(cardPosition: string) {
  return runSession({
    command: CARD_SHOW,
    isPrivileged: true,
    params: [cardPosition],
    onEvent: ({
      data,
      onError,
      onComplete,
    }: {
      data: string;
      onError: () => void;
      onComplete: (card: Card | undefined) => void;
    }) => {
      const nextCard = parseAccxCard(data);

      if (validateCard(nextCard)) {
        onComplete(nextCard);
      } else {
        onError();
      }
    },
  });
}
