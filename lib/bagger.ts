import { BaggerResponse } from './response';
import { BaggerRequest } from './request';
import { SchemaObject } from 'openapi3-ts';
import { BaggerRequestBody } from './request_body';
export * from './compile';

/**
 * Creates a Response object
 * @param httpCode The HTTP Code that the response represents
 */
export function response(httpCode: number): BaggerResponse {
  return new BaggerResponse(httpCode);
}

/**
 * Creates a Request object
 */
export function request(): BaggerRequest {
  return new BaggerRequest();
}

export function requestBody(): BaggerRequestBody {
  return new BaggerRequestBody();
}
