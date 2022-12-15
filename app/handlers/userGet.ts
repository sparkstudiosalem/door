import { operations } from "../generated/schema/openapi";
import { OpenAPIHandler } from "../types/openapi";
import getDeviceUser from "../utils/serial/getDeviceUser";

export default (async function userGet(req, res) {
  const user = await getDeviceUser(req.params.userId);

  if (!user) {
    res.sendStatus(404);
    return;
  }

  res.json(user);
} as OpenAPIHandler<operations, "userGet">);
