import { operations } from "../generated/schema/openapi";
import { OpenAPIHandler } from "../types/openapi";
import getDeviceUsers from "../utils/serial/getDeviceUsers";

export default (async function usersGet(_req, res) {
  const users = await getDeviceUsers();

  res.json(users);
} as OpenAPIHandler<operations, "usersGet">);
