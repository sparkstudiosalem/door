import { operations } from "../generated/schema/openapi";
import getDeviceTime from "../utils/serial/getDeviceTime";
import { OpenAPIHandler } from "../types/openapi";

export default (async function timeGet(_req, res) {
  const deviceTime = await getDeviceTime();

  res.json(deviceTime.toISOString());
} as OpenAPIHandler<operations, "timeGet">);
