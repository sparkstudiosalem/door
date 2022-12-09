import { operations } from "../generated/schema/openapi";
import { OpenAPIHandler } from "../types/openapi";
import getDeviceUsers from "../utils/serial/getDeviceUsers";

export default (async function usersGet(_req, res) {
  const deviceUsers = await getDeviceUsers();

  res.json(deviceUsers);
} as OpenAPIHandler<operations, "usersGet">);
