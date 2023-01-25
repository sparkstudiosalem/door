import parseAccxCard from "../parseAccxCard";
import { runSession } from "./serial";
import { CARD_REMOVE } from "./constants";

export default async function removeDeviceCard(cardPosition: string) {
  return runSession({
    command: CARD_REMOVE,
    isPrivileged: true,
    params: [cardPosition],
    onEvent: ({
      data,
      onComplete,
    }: {
      data: string;
      onComplete: (result: Boolean) => void;
    }) => {
      const nextCard = parseAccxCard(data);

      onComplete(!!nextCard);
    },
  });
}
