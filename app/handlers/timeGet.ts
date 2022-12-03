import { operations } from "../generated/schema/openapi";
import { OpenAPIHandler } from "../types/openapi";

export default (async function timeGet(_req, res) {
  res.json("2020-01-01T00:00:00.000Z");
} as OpenAPIHandler<operations, "timeGet">);
