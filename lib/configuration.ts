import { BaggerRequest } from './request';
import {
  ExternalDocumentationObject,
  SecurityRequirementObject,
  ServerObject,
  InfoObject,
  OpenAPIObject,
  PathsObject
} from 'openapi3-ts';
import { cleanObject } from './utils/clean_object';

interface SwaggerConfiguration {
  info: InfoObject;
  servers?: ServerObject[];
  security?: SecurityRequirementObject[];
  externalDocs?: ExternalDocumentationObject;
}

export class BaggerConfiguration {
  private internalConfiguration: BaggerConfigurationInternal;

  public constructor(internalConfiguration: BaggerConfigurationInternal) {
    this.internalConfiguration = internalConfiguration;
  }

  public info(info: InfoObject): BaggerConfiguration {
    this.internalConfiguration.setInfo(info);
    return this;
  }

  public addServer(server: ServerObject): BaggerConfiguration {
    this.internalConfiguration.addServer(server);
    return this;
  }

  public addSecurity(security: SecurityRequirementObject): BaggerConfiguration {
    this.internalConfiguration.addSecurity(security);
    return this;
  }

  public externalDocs(externalDocs: ExternalDocumentationObject): BaggerConfiguration {
    this.internalConfiguration.setExternalDocs(externalDocs);
    return this;
  }
}

export class BaggerConfigurationInternal {
  private requests: BaggerRequest[] = [];
  private configuration: SwaggerConfiguration = {
    info: {
      title: '',
      version: ''
    }
  };

  public addRequest(request: BaggerRequest): void {
    this.requests.push(request);
  }

  public setInfo(info: InfoObject): void {
    this.configuration.info = info;
  }

  public addServer(server: ServerObject): void {
    if (!this.configuration.servers) {
      this.configuration.servers = [];
    }
    this.configuration.servers.push(server);
  }

  public addSecurity(security: SecurityRequirementObject): void {
    if (!this.configuration.security) {
      this.configuration.security = [];
    }
    this.configuration.security.push(security);
  }

  public setExternalDocs(externalDocs: ExternalDocumentationObject): void {
    this.configuration.externalDocs = externalDocs;
  }

  private mergeRequests(): PathsObject {
    const mergedRequests = this.requests
      .map(request => request.compile())
      .reduce((paths, request) => {
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

  public compile(): OpenAPIObject {
    const paths = this.mergeRequests();
    return cleanObject({
      ...this.configuration,
      openapi: '3.0.0',
      paths
    });
  }
}
