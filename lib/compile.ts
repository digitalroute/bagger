import {
  OpenAPIObject,
  InfoObject,
  ServerObject,
  PathsObject,
  SecurityRequirementObject,
  ExternalDocumentationObject,
  ComponentsObject
} from 'openapi3-ts';
import { BaggerRequest } from './request';

interface SwaggerConfiguration {
  info: InfoObject;
  servers?: ServerObject[];
  security?: SecurityRequirementObject[];
  externalDocs?: ExternalDocumentationObject;
}

// TODO: Remove next line as this is a temporary eslint disable
// eslint-disable-next-line
function compileRequests(requests: BaggerRequest[]): PathsObject {
  return {};
}

/**
 * Compiles all requests into a Swagger definition.
 * @param configuration General configuration settings describing the API.
 * @param requests All requests that together describe the API.
 * @param components Any additional components that are externally defined.
 */
export function compile(
  configuration: SwaggerConfiguration,
  requests: BaggerRequest[],
  components?: ComponentsObject
): OpenAPIObject {
  const paths = compileRequests(requests);

  return {
    ...configuration,
    openapi: '3.0',
    paths,
    components
  };
}
