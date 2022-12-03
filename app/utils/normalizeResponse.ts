// // type ObjectIdsAreStrings<TResponse> = TResponse extends ObjectId
// //   ? string
// //   : TResponse extends (infer TResponseItem)[]
// //   ? ObjectIdsAreStrings<TResponseItem>[]
// //   : TResponse extends Date
// //   ? string
// //   : TResponse extends object
// //   ? {
// //       [TResponseKey in keyof TResponse]: ObjectIdsAreStrings<
// //         TResponse[TResponseKey]
// //       >;
// //     }
// //   : TResponse;

// // function isObjectId(response: any): response is ObjectId {
// //   return response instanceof ObjectId;
// // }

// function normalizeResponseObject<TResponse>(
//   response: TResponse
// ): ObjectIdsAreStrings<TResponse> {
//   const nextResponse: Partial<{
//     [K in keyof TResponse]: ObjectIdsAreStrings<TResponse[K]>;
//   }> = {};

//   // eslint-disable-next-line guard-for-in
//   for (const key in response) {
//     nextResponse[key] = normalizeResponse(response[key]);
//   }

//   return nextResponse as ObjectIdsAreStrings<TResponse>;
// }

// export default function normalizeResponse<TResponse>(
//   response: TResponse
// ): ObjectIdsAreStrings<TResponse> {
//   if (Array.isArray(response)) {
//     return response.map(normalizeResponse) as ObjectIdsAreStrings<TResponse>;
//   }

//   if (response instanceof Date) {
//     return response.toISOString() as ObjectIdsAreStrings<TResponse>;
//   }

//   if (
//     response !== null &&
//     response !== undefined &&
//     typeof response === "object"
//   ) {
//     return normalizeResponseObject(response);
//   }

//   return response as ObjectIdsAreStrings<TResponse>;
// }

export const foo = true;
