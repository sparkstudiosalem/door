import { operations } from "../generated/schema/openapi";
import getDeviceStatus from "../utils/serial/getDeviceStatus";
import { OpenAPIHandler } from "../types/openapi";

export default (async function timeGet(_req, res) {
  const deviceStatus = await getDeviceStatus();

  res.json(deviceStatus);
} as OpenAPIHandler<operations, "statusGet">);
