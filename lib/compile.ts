import {
  OpenAPIObject,
  InfoObject,
  ServerObject,
  PathsObject,
  SecurityRequirementObject,
  ExternalDocumentationObject,
  ComponentsObject
} from 'openapi3-ts';
import { BaggerRequest, CompiledRequest } from './request';
import { cleanObject } from './utils/clean_object';

interface SwaggerConfiguration {
  info: InfoObject;
  servers?: ServerObject[];
  security?: SecurityRequirementObject[];
  externalDocs?: ExternalDocumentationObject;
}

function compileRequests(requests: BaggerRequest[]): PathsObject {
  const compiledRequests = requests.map(request => request.compile());

  const mergedRequests = compiledRequests.reduce((paths, request) => {
    const requestObject = Object.entries(request)[0];
    const [path, definition] = requestObject;

    paths[path] = {
      ...definition,
      ...paths[path]
    };

    return paths;
  }, {});

  return mergedRequests;
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

  return cleanObject({
    ...configuration,
    openapi: '3.0',
    paths,
    components
  });
}
