import { operations } from "../generated/schema/openapi";
import { OpenAPIHandler } from "../types/openapi";
import updateDeviceUser from "../utils/serial/updateDeviceUser";

export default (async function userPut(req, res) {
  try {
    const isSuccessful = await updateDeviceUser(
      req.params.userId,
      req.body.currentBadge,
      req.body.badge,
      req.body.userMask
    );

    if (isSuccessful) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch {
    res.sendStatus(400);
  }
} as OpenAPIHandler<operations, "userPut">);
