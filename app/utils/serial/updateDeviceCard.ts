import parseAccxCard from "../parseAccxCard";
import { runSession } from "./serial";
import { CARD_UPDATE } from "./constants";
import getDeviceCard from "./getDeviceCard";

export default async function updateDeviceCard(
  cardPosition: string,
  currentBadge: string,
  badge: string,
  permissions: number
) {
  const currentCard = await getDeviceCard(cardPosition);

  if (!currentCard || currentCard.badge !== currentBadge) {
    return Promise.reject();
  }

  return runSession({
    command: CARD_UPDATE,
    isPrivileged: true,
    params: [cardPosition, permissions, badge],
    onEvent: ({
      data,
      onComplete,
      onError,
    }: {
      onError: () => void;
      onComplete: (isSuccessful: boolean) => void;
      data: string;
    }) => {
      const nextCard = parseAccxCard(data);

      if (nextCard) {
        onComplete(true);
      } else {
        onError();
      }
    },
  });
}
