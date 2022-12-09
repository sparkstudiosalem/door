import { Request, Response } from "express";

type SuccessStatusCode = 200;
type CreatedStatusCode = 201;
type NoContentStatusCode = 204;
type BadRequestStatusCode = 400;
type UnauthorizedStatusCode = 401;
type ForbiddenStatusCode = 403;
type NotFoundStatusCode = 404;
type GoneStatusCode = 410;
type TooManyRequestsStatusCode = 429;
type InternalServerStatusCode = 500;
type ResponseStatusCode =
  | BadRequestStatusCode
  | CreatedStatusCode
  | ForbiddenStatusCode
  | GoneStatusCode
  | InternalServerStatusCode
  | NoContentStatusCode
  | NotFoundStatusCode
  | SuccessStatusCode
  | TooManyRequestsStatusCode
  | UnauthorizedStatusCode;

interface OpenAPIOperationRequestBody {
  readonly content: {
    readonly "application/json": unknown;
  };
}

type OpenAPIRequestParameters = {
  readonly header?: unknown;
  readonly path?: unknown;
  readonly query?: unknown;
};

interface OpenAPIOperation {
  readonly parameters?: OpenAPIRequestParameters;
  readonly requestBody?: OpenAPIOperationRequestBody;
  readonly responses: Partial<
    Record<ResponseStatusCode, OpenAPIOperationRequestBody>
  >;
}

export type OpenAPIOperations<TOperations> = {
  [P in keyof TOperations]: OpenAPIOperation;
};

type OpenAPIOperationParameters<
  TOperations extends OpenAPIOperations<TOperations>,
  TOperation extends keyof TOperations
> = TOperations[TOperation]["parameters"] extends OpenAPIRequestParameters
  ? TOperations[TOperation]["parameters"]["query"]
  : never;

type OpenAPIRequest<
  TOperations extends OpenAPIOperations<TOperations>,
  TOperation extends keyof TOperations,
  TRequestExtra
> = Request<
  TOperations[TOperation]["parameters"] extends OpenAPIRequestParameters
    ? TOperations[TOperation]["parameters"]["path"]
    : never,
  never,
  TOperations[TOperation]["requestBody"] extends OpenAPIOperationRequestBody
    ? TOperations[TOperation]["requestBody"]["content"]["application/json"]
    : never,
  OpenAPIOperationParameters<TOperations, TOperation>
> &
  TRequestExtra;

type OpenAPIResponsesDetails<
  TOperations extends OpenAPIOperations<TOperations>,
  TOperation extends keyof TOperations
> = TOperations[TOperation]["responses"][keyof TOperations[TOperation]["responses"]];

type OpenAPIResponses<
  TOperations extends OpenAPIOperations<TOperations>,
  TOperation extends keyof TOperations
> = OpenAPIResponsesDetails<
  TOperations,
  TOperation
> extends OpenAPIOperationRequestBody
  ? OpenAPIResponsesDetails<
      TOperations,
      TOperation
    >["content"]["application/json"]
  : never;

type OpenAPIResponse<
  TOperations extends OpenAPIOperations<TOperations>,
  TOperation extends keyof TOperations,
  TLocals extends Record<string, any>
> = Response<OpenAPIResponses<TOperations, TOperation>, TLocals>;

export type OpenAPIHandler<
  TOperations extends OpenAPIOperations<TOperations>,
  TOperation extends keyof TOperations,
  TLocals extends Record<string, any> = Record<string, never>,
  TRequestExtra = unknown
> = (
  req: OpenAPIRequest<TOperations, TOperation, TRequestExtra>,
  res: OpenAPIResponse<TOperations, TOperation, TLocals>
) => Promise<void> | void;
