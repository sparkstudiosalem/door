import { operations } from "../generated/schema/openapi";
import { OpenAPIHandler } from "../types/openapi";
import getDeviceCard from "../utils/serial/getDeviceCard";

export default (async function cardGet(req, res) {
  const card = await getDeviceCard(req.params.cardPosition);

  if (!card) {
    res.sendStatus(404);
    return;
  }

  res.json(card);
} as OpenAPIHandler<operations, "cardGet">);
