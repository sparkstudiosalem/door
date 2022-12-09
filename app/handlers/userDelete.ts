import { operations } from "../generated/schema/openapi";
import { OpenAPIHandler } from "../types/openapi";
import removeDeviceUser from "../utils/serial/removeDeviceUser";

export default (async function userGet(req, res) {
  const result = await removeDeviceUser(req.params.userId);

  if (result) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
} as OpenAPIHandler<operations, "userGet">);
