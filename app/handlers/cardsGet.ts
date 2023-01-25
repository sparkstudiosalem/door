import { operations } from "../generated/schema/openapi";
import { OpenAPIHandler } from "../types/openapi";
import getDeviceCards from "../utils/serial/getDeviceCards";

export default (async function cardsGet(_req, res) {
  const cards = await getDeviceCards();

  res.json(cards);
} as OpenAPIHandler<operations, "cardsGet">);
