import { BaggerResponse } from './response';
import { BaggerRequest, Method } from './request';
import { BaggerRequestBody } from './request_body';
export * from './compile';

/**
 * Creates a Response object
 * @param httpCode The HTTP Code that the response represents
 * @returns A bagger response that can be used to create a compiled Swagger definition.
 * @example
 * ```
 * const bagger = require('.');
 * 
 * const getBags = bagger
 *   .response(200)
 *   .description('Successfully fetched all bags')
 *   .content('text/plain', { type: 'string' });
 
 * ```
 */
export function response(httpCode: number): BaggerResponse {
  return new BaggerResponse(httpCode);
}

/**
 * Creates a Request object
 */
export function request(path: string, method: Method): BaggerRequest {
  return new BaggerRequest(path, method);
}

export function requestBody(): BaggerRequestBody {
  return new BaggerRequestBody();
}
