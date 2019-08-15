import { BaggerResponse } from './response';
import { BaggerRequest, Method } from './request';
import { BaggerRequestBody } from './request_body';
import { BaggerConfiguration, BaggerConfigurationInternal } from './configuration';
import { OpenAPIObject } from 'openapi3-ts';
import { BaggerParameter, ParameterType } from './parameters';
import { schemaStorage } from './schema_storage';
import { JSONSchema7 } from 'json-schema';
import { Schema } from '@hapi/joi';

const internalConfiguration = new BaggerConfigurationInternal();
const configuration = new BaggerConfiguration(internalConfiguration);

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
export function addRequest(path: string, method: Method): BaggerRequest {
  const req = new BaggerRequest(path, method);
  internalConfiguration.addRequest(req);
  return req;
}

export function requestBody(): BaggerRequestBody {
  return new BaggerRequestBody();
}

export function parameter(): { [key in ParameterType]: (name: string) => BaggerParameter } {
  return {
    query: (name: string) => new BaggerParameter('query', name),
    path: (name: string) => new BaggerParameter('path', name),
    cookie: (name: string) => new BaggerParameter('cookie', name),
    header: (name: string) => new BaggerParameter('header', name)
  };
}

export function configure(): BaggerConfiguration {
  return configuration;
}

export function compile(): OpenAPIObject {
  return internalConfiguration.compile();
}

export function getRequestSchema(path: string, method: string): JSONSchema7 | Schema {
  return schemaStorage.getRequestSchema(path, method);
}
