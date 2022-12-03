import path from "path";
import express from "express";
import * as swaggerUi from "swagger-ui-express";
import * as OpenApiValidator from "express-openapi-validator";
import schema from "./generated/schema/openapi.json";
import * as _handlers from "./handlers/index";

export default function createApp() {
  const app = express();

  // Serve OpenAPI schema
  app.use("/openapi.json", (_req, res) => {
    res.json(schema);
  });

  // Serve documentation
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(schema));

  // Service API requests through OpenAPI validator
  // Individual endpoints are serviced by handlers in ./handlers
  // Each endpoint + method has an x-eov-operation-handler defined
  // in the openapi.yaml schema.
  app.use(
    OpenApiValidator.middleware({
      apiSpec: schema as any,
      ignoreUndocumented: true,
      operationHandlers: path.join(__dirname, "./handlers"),
      validateRequests: true,
      validateResponses: true,
    })
  );

  // Redirect root requests to the interactive Swagger UI documentation
  app.get("/", (_req, res) => {
    res.redirect("/docs");
  });

  return app;
}
