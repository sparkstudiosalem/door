import { Card } from "./serial/constants";

export function isCard(card: Card | undefined): card is Card {
  return !!card;
}
