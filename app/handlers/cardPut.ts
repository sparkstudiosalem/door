import { operations } from "../generated/schema/openapi";
import { OpenAPIHandler } from "../types/openapi";
import updateDeviceCard from "../utils/serial/updateDeviceCard";

export default (async function cardPut(req, res) {
  try {
    const isSuccessful = await updateDeviceCard(
      req.params.cardPosition,
      req.body.currentBadge,
      req.body.badge,
      req.body.permissions
    );

    if (isSuccessful) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch {
    res.sendStatus(400);
  }
} as OpenAPIHandler<operations, "cardPut">);
