import { operations } from "../generated/schema/openapi";
import { OpenAPIHandler } from "../types/openapi";
import getDeviceUser from "../utils/serial/getDeviceUser";

export default (async function userGet(req, res) {
  const deviceUser = await getDeviceUser(req.params.userId);

  if (!deviceUser) {
    res.sendStatus(404);
    return;
  }

  res.json(deviceUser);
} as OpenAPIHandler<operations, "userGet">);
