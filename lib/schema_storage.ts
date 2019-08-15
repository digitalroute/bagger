import { JSONSchema7 } from 'json-schema';
import { Schema } from '@hapi/joi';

export class BaggerSchemaDoesNotExistForKeyError extends Error {}

class SchemaStorage {
  private requestToSchema: Map<string, JSONSchema7 | Schema> = new Map<string, JSONSchema7 | Schema>();

  private buildKey(path: string, method: string): string {
    return `${method.toUpperCase()}_${path.toUpperCase()}`;
  }

  public addRequestSchema(path: string, method: string, schema: JSONSchema7 | Schema): void {
    this.requestToSchema.set(this.buildKey(path, method), schema);
  }

  public getRequestSchema(path: string, method: string): JSONSchema7 | Schema {
    const key = this.buildKey(path, method);
    const schema = this.requestToSchema.get(key);
    if (!schema) {
      throw new BaggerSchemaDoesNotExistForKeyError();
    }
    return schema;
  }
}

export const schemaStorage = new SchemaStorage();
