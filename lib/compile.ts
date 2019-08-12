import {
  OpenAPIObject,
  InfoObject,
  ServerObject,
  PathsObject,
  ComponentsObject,
  SecurityRequirementObject,
  ExternalDocumentationObject
} from 'openapi3-ts';
import { BaggerRequest } from './request';

type SwaggerConfiguration = {
  info: InfoObject;
  servers?: ServerObject[];
  security?: SecurityRequirementObject[];
  externalDocs?: ExternalDocumentationObject;
};

function compileRequests(requests: BaggerRequest[]): PathsObject {
  return {};
}

export function compile(
  configuration: SwaggerConfiguration,
  requests: BaggerRequest[],
  components?: any
): OpenAPIObject {
  const paths = compileRequests(requests);

  return {
    ...configuration,
    openapi: '3.0',
    paths,
    components
  };
}
