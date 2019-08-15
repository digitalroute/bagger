import { BaggerResponse } from './response';
import { BaggerRequest, Method } from './request';
import { BaggerRequestBody } from './request_body';
import { BaggerConfiguration, BaggerConfigurationInternal } from './configuration';
import { OpenAPIObject } from 'openapi3-ts';
import { BaggerParameter, ParameterType } from './parameters';
import { BaggerSchemaComponent } from './component';
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
 * @param path The url/path to the request
 * @param method HTTP method like 'GET' or 'PUT'
 */
export function addRequest(path: string, method: Method): BaggerRequest {
  const request = new BaggerRequest(path, method);
  internalConfiguration.addRequest(request);
  return request;
}

/**
 * Add a reusable data model (schema).
 * @param name A unique id that is used to referance the component.
 * @param schema A `@hapi/joi` schema that describes the data model.
 */
const addSchemaComponent = (name: string, schema: Schema): BaggerSchemaComponent => {
  const component = new BaggerSchemaComponent(name, schema);
  internalConfiguration.addSchemaComponent(component);
  return component;
};

export function addComponent(): { schema: (name: string, schema: Schema) => BaggerSchemaComponent } {
  return {
    schema: addSchemaComponent
  };
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
