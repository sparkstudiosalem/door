import { operations } from "../generated/schema/openapi";
import { OpenAPIHandler } from "../types/openapi";
import removeDeviceCard from "../utils/serial/removeDeviceCard";

export default (async function cardDelete(req, res) {
  const result = await removeDeviceCard(req.params.cardPosition);

  if (result) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
} as OpenAPIHandler<operations, "cardDelete">);
