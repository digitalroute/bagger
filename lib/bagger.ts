import { BaggerResponse } from './response';
import { BaggerRequest, Method } from './request';
import { BaggerRequestBody } from './request_body';
import { BaggerConfiguration, BaggerConfigurationInternal } from './configuration';
import { OpenAPIObject, SecuritySchemeType } from 'openapi3-ts';
import { BaggerParameter, ParameterType } from './parameters';
import { BaggerComponentAdder, BaggerComponentGetter, BaggerSecurityComponent } from './component';
import { schemaStorage, SchemaDefinition } from './schema_storage';

const internalConfiguration = new BaggerConfigurationInternal();
const configuration = new BaggerConfiguration(internalConfiguration);
const componentAdder = new BaggerComponentAdder(internalConfiguration);
const componentGetter = new BaggerComponentGetter(internalConfiguration);

/**
 * Creates a Response object
 * @param httpCode The HTTP Code that the response represents
 * @returns A bagger response that can be used to create a compiled Swagger definition.
 * @example
 * ```js
 * const bagger = require('digitalroute/bagger');
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
 * @param path Path representing the request
 * @param method HTTP method for this path. Multiple methods can be added for a path by calling
 * addRequest for the same path multiple times.
 * @example
 * ```js
 * const bagger = require('.');
 * const joi = require('@hapi/joi');
 *
 * bagger
 *   .addRequest('/bags', 'get')
 *   .addTag('bags')
 *   .addTag('getters')
 *   .addSecurity('OAuth2')
 *   .addParameter(
 *     bagger
 *       .parameter()
 *       .query('bagSize')
 *       .schema(joi.string().valid(['10L', '20L', '30L'])
 *       .required(true)
 *   )
 *   .addResponse(
 *     bagger
 *       .response(204)
 *       .description('Fetched bag of given size')
 *   );
 * ```
 */
export function addRequest(path: string, method: Method): BaggerRequest {
  const request = new BaggerRequest(path, method);
  internalConfiguration.addRequest(request);
  return request;
}

export function securityComponent(name: string, type: SecuritySchemeType): BaggerSecurityComponent {
  return new BaggerSecurityComponent(name, type);
}

/**
 * Add a reusable component that can be referenced to.
 */
export function addComponent(): BaggerComponentAdder {
  return componentAdder;
}

/**
 * Get a reusable component.
 */
export function getComponent(): BaggerComponentGetter {
  return componentGetter;
}

/**
 * Create a request body used for defining a body in a bagger request
 * @example
 * ```js
 * const bagger = require('.');
 * const joi = require('@hapi/joi');
 *
 * const body = bagger
 *   .requestBody()
 *   .description('Create a bag')
 *   .content('application/json',
 *     joi.object().keys({
 *       type: joi.string().valid(['backpack', 'duffel', 'sports']).required(),
 *       size: joi.array().items(joi.string().valid(['10L', '20L', '30L']).required()).required(),
 *       description: joi.string().optional()
 *     })
 *   )
 *   .required(true);
 *
 * bagger
 *   .addRequest('/bags', 'post')
 *   .body(body)
 * ...
 * ```
 */
export function requestBody(): BaggerRequestBody {
  return new BaggerRequestBody();
}

/**
 * Create a parameter used for defining query, path, cookie or header parameter in bagger requests.
 * @example
 * ```js
 * const bagger = require('bagger');
 * const parameter = bagger
 *   .parameter()
 *   .path('bagId')
 *   .schema(joi.string().required())
 *   .description('ID of one bag')
 *   .explode(true)
 *   .required(true);
 *
 * bagger
 *   .addRequest('/bags/{bagId}', 'get')
 *   .addParameter(parameter)
 * ...
 * ```
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
 * Get the configuration object for bagger. This defines the configuration for all endpoints.
 * @example
 * ```js
 * const bagger = require('bagger');
 * bagger
 *   .configure()
 *   .info({
 *     title: 'Bagger API',
 *     version: 'v1',
 *     description: 'Provides resources to building swagger definitions'
 *   })
 *   .addServer({
 *     url: 'https://localhost:3000',
 *     description: 'Local development'
 *   })
 * ...
 * ```
 */
export function configure(): BaggerConfiguration {
  return configuration;
}

/**
 * Compiles bagger into an OpenAPI schema. This has to be done _after_ all requests has been added to
 * bagger.
 * @returns An OpenAPI schema that can be used to render a UI.
 */
export function compile(): OpenAPIObject {
  return internalConfiguration.compile();
}

/**
 * Get the validation object for a specific path and method. The result can be used for validation.
 * This comes from `bagger.parameter()` and `bagger.requestBody()`, and they have to be declared on the request before getting them.
 * @param path The url/path to the request
 * @param method HTTP method like 'GET' or 'PUT'
 * @param contentType
 */
export function getRequestSchema(
  path: string,
  method: string,
  contentType: string = 'application/json'
): SchemaDefinition {
  return schemaStorage.getRequestSchema(path, method, contentType);
}
