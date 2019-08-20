import { BaggerRequest } from './request';
import {
  ExternalDocumentationObject,
  ServerObject,
  InfoObject,
  OpenAPIObject,
  PathsObject,
  ComponentsObject
} from 'openapi3-ts';
import { cleanObject } from './utils/clean_object';
import { validateSchema } from './utils/validate_schema';
import {
  BaggerSchemaComponent,
  SchemaComponentObject,
  BaggerSecurityComponent,
  SecuritySchemeComponentObject
} from './component';
import { Schema } from '@hapi/joi';

class BaggerMultipleComponentsWithSameNameFoundError extends Error {}
class BaggerComponentNotFoundError extends Error {}

interface SwaggerConfiguration {
  info: InfoObject;
  servers?: ServerObject[];
  externalDocs?: ExternalDocumentationObject;
}

export class BaggerConfiguration {
  private internalConfiguration: BaggerConfigurationInternal;

  public constructor(internalConfiguration: BaggerConfigurationInternal) {
    this.internalConfiguration = internalConfiguration;
  }

  /**
   * Create the information object in an OpenAPI schema.
   * @param info Defines the information object in an OpenAPI schema
   */
  public info(info: InfoObject): BaggerConfiguration {
    this.internalConfiguration.setInfo(info);
    return this;
  }

  /**
   * Add a server to the configuration.
   * @param server The server object
   */
  public addServer(server: ServerObject): BaggerConfiguration {
    this.internalConfiguration.addServer(server);
    return this;
  }

  /**
   * Define external documentation for the OpenAPI schema.
   * @param externalDocs The external documentation object. Containing an URL.
   */
  public externalDocs(externalDocs: ExternalDocumentationObject): BaggerConfiguration {
    this.internalConfiguration.setExternalDocs(externalDocs);
    return this;
  }
}

interface BaggerComponents {
  schemas: BaggerSchemaComponent[];
  securitySchemes: BaggerSecurityComponent[];
}

export class BaggerConfigurationInternal {
  private requests: BaggerRequest[] = [];
  private components: BaggerComponents = {
    schemas: [],
    securitySchemes: []
  };
  private configuration: SwaggerConfiguration = {
    info: {
      title: '',
      version: ''
    }
  };

  public addRequest(request: BaggerRequest): void {
    this.requests.push(request);
  }

  public addSecurityComponent(component: BaggerSecurityComponent): void {
    this.components.securitySchemes.push(component);
  }

  public addSchemaComponent(component: BaggerSchemaComponent): void {
    this.components.schemas.push(component);
  }

  public getSchemaComponent(name: string): Schema {
    const schemas = this.components.schemas.filter(schema => schema.getName() === name);
    if (schemas.length === 0) {
      throw new BaggerComponentNotFoundError();
    }
    if (schemas.length > 1) {
      throw new BaggerMultipleComponentsWithSameNameFoundError();
    }
    return schemas[0].getSchema() as Schema;
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

  public compileSchemaComponents(): SchemaComponentObject {
    const unmergedComponents = this.components.schemas.map(component => component.compile());
    return unmergedComponents.reduce((schemas: SchemaComponentObject, component) => {
      schemas[component.name] = component.schema;
      return schemas;
    }, {});
  }

  public compileSecurityComponents(): SecuritySchemeComponentObject {
    const unmergedComponents = this.components.securitySchemes.map(component => component.compile());
    return unmergedComponents.reduce((securitySchemes: SecuritySchemeComponentObject, component) => {
      securitySchemes = {
        ...securitySchemes,
        ...component
      };
      return securitySchemes;
    }, {});
  }

  private compileComponents(): ComponentsObject {
    const schemas = this.compileSchemaComponents();
    const securitySchemes = this.compileSecurityComponents();
    return {
      schemas,
      securitySchemes
    };
  }

  public compile(): OpenAPIObject {
    const paths = this.mergeRequests();

    const components = this.compileComponents();

    const swaggerDefinition = cleanObject({
      ...this.configuration,
      openapi: '3.0.0',
      paths,
      components
    });

    const errors = validateSchema(swaggerDefinition);

    if (errors.length > 0) {
      throw new Error(JSON.stringify(errors));
    }

    return swaggerDefinition;
  }
}
