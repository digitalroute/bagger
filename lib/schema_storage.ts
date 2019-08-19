import { Schema } from '@hapi/joi';
import { ContentSchemas } from './content';

export class BaggerSchemaDoesNotExistForKeyError extends Error {}

export class BaggerCannotAddParmeterSchemaWithoutNameError extends Error {}

export class BaggerCannotResolveSwaggerKeyError extends Error {}

interface KeyToSchema {
  [key: string]: Schema;
}
export interface SchemaDefinition {
  body?: Schema;
  query?: KeyToSchema;
  headers?: KeyToSchema;
  params?: KeyToSchema;
  cookies?: KeyToSchema;
}

export interface PathSchema {
  [contentType: string]: SchemaDefinition;
}
interface RequestToSchema {
  [key: string]: PathSchema;
}

type SwaggerLocationTypes = 'cookie' | 'header' | 'path' | 'body' | 'query';

class SchemaStorage {
  private readonly swaggerKeyToJoiKey = {
    cookie: 'cookies',
    header: 'headers',
    path: 'params',
    body: 'body',
    query: 'query'
  };
  private requestToSchema: RequestToSchema = {};

  private buildKey(path: string, method: string): string {
    return `${method.toUpperCase()}_${path.toUpperCase()}`;
  }

  private toJoiType = (key: SwaggerLocationTypes): keyof SchemaDefinition => {
    const type = this.swaggerKeyToJoiKey[key] as keyof SchemaDefinition;
    if (!type) {
      throw new BaggerCannotResolveSwaggerKeyError();
    }
    return type;
  } 

  public addRequestSchemas(path: string, method: string, schemas: ContentSchemas, type: SwaggerLocationTypes, parameterName?: string): void {
    const key = this.buildKey(path, method);
    if (!this.requestToSchema[key]) {
      this.requestToSchema[key] = {};
    }
    const joiType = this.toJoiType(type);
    Object.keys(schemas).forEach((contentType: string): void => {
      if (!this.requestToSchema[key][contentType]) {
        this.requestToSchema[key][contentType] = {};
      }
      if (joiType !== 'body') {
        if (!parameterName) {
          throw new BaggerCannotAddParmeterSchemaWithoutNameError();
        }

        const params = this.requestToSchema[key][contentType][joiType] || {};
        this.requestToSchema[key][contentType][joiType] = {
          ...params,
          [parameterName]: schemas[contentType]
        };
      } else {
        this.requestToSchema[key][contentType][joiType] = schemas[contentType];
      }
    });
  }

  public getRequestSchema(path: string, method: string, contentType: string = 'application/json'): SchemaDefinition {
    const key = this.buildKey(path, method);
    const schema = this.requestToSchema[key];
    if (!schema) {
      throw new BaggerSchemaDoesNotExistForKeyError();
    }
    if (!schema[contentType]) {
      throw new BaggerSchemaDoesNotExistForKeyError();
    }
    return schema[contentType];
  }
}

export const schemaStorage = new SchemaStorage();
