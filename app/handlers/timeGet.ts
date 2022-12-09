import createSerialPortRunner from "../createSerialPortRunner";
import { operations } from "../generated/schema/openapi";
import { OpenAPIHandler } from "../types/openapi";

const runner = createSerialPortRunner();

export default (async function timeGet(_req, res) {
  const deviceTime = await runner.getDeviceTime();

  res.json(deviceTime.toISOString());
} as OpenAPIHandler<operations, "timeGet">);
