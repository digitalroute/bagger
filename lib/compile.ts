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
