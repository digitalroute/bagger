import { Schema } from '@hapi/joi';
import { ContentSchemas } from './content';

export class BaggerSchemaDoesNotExistForKeyError extends Error {}

export interface SchemaDefinition {
  body?: Schema;
  query?: Schema;
  header?: Schema;
  path?: Schema;
  cookie?: Schema;
}

export interface PathSchema {
  [contentType: string]: SchemaDefinition;
}
interface RequestToSchema {
  [key: string]: PathSchema;
}
class SchemaStorage {
  private requestToSchema: RequestToSchema = {};

  private buildKey(path: string, method: string): string {
    return `${method.toUpperCase()}_${path.toUpperCase()}`;
  }

  public addRequestSchemas(path: string, method: string, schemas: ContentSchemas, type: keyof SchemaDefinition): void {
    const key = this.buildKey(path, method);
    if (!this.requestToSchema[key]) {
      this.requestToSchema[key] = {};
    }
    Object.keys(schemas).forEach((contentType: string): void => {
      if (!this.requestToSchema[key][contentType]) {
        this.requestToSchema[key][contentType] = {};
      }
      this.requestToSchema[key][contentType][type] = schemas[contentType];
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
