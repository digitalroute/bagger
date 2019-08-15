import { BaggerResponse } from './response';
import { BaggerRequest, Method } from './request';
import { BaggerRequestBody } from './request_body';
import { BaggerConfiguration, BaggerConfigurationInternal } from './configuration';
import { OpenAPIObject } from 'openapi3-ts';
import { BaggerParameter, ParameterType } from './parameters';
import { BaggerComponentAdder } from './component';
import { schemaStorage } from './schema_storage';
import { Schema } from '@hapi/joi';

const internalConfiguration = new BaggerConfigurationInternal();
const configuration = new BaggerConfiguration(internalConfiguration);
const componentAdder = new BaggerComponentAdder(internalConfiguration);

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
 * @param path The url/path to the request
 * @param method HTTP method like 'GET' or 'PUT'
 */
export function addRequest(path: string, method: Method): BaggerRequest {
  const request = new BaggerRequest(path, method);
  internalConfiguration.addRequest(request);
  return request;
}

/**
 * Add a reusable component that can be referenced to.
 */
export function addComponent(): BaggerComponentAdder {
  return componentAdder;
}

/**
 * Create a request body that can be used to describe the body of a request.
 * @example
 * ```
 * bagger.addRequest('/bags', 'post').body(
 *   bagger.requestBody().content(
 *     'application/json',
 *     joi.object.keys({
 *       name: joi.string().required(),
 *       hasSwag: joi.boolean().optional()
 *     })
 *   )
 * );
 * ```
 */
export function requestBody(): BaggerRequestBody {
  return new BaggerRequestBody();
}

/**
 * Create a parameter
 */
export function parameter(): { [key in ParameterType]: (name: string) => BaggerParameter } {
  return {
    query: (name: string) => new BaggerParameter('query', name),
    path: (name: string) => new BaggerParameter('path', name),
    cookie: (name: string) => new BaggerParameter('cookie', name),
    header: (name: string) => new BaggerParameter('header', name)
  };
}

/**
 * Get a referance to the global bagger configuration.
 */
export function configure(): BaggerConfiguration {
  return configuration;
}

/**
 * Create a swagger definition that can be used to serve a swagger web page.
 */
export function compile(): OpenAPIObject {
  return internalConfiguration.compile();
}

/**
 * Get the validation object for a specific path and method. The result can be used for validation.
 * This comes from `bagger.parameter()` and `bagger.requestBody()`, and they have to be declared on the request before getting them.
 * @param path The url/path to the request
 * @param method HTTP method like 'GET' or 'PUT'
 */
export function getRequestSchema(path: string, method: string): Schema {
  return schemaStorage.getRequestSchema(path, method);
}
