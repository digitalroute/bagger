import { Schema } from '@hapi/joi';

export class BaggerSchemaDoesNotExistForKeyError extends Error {}

class SchemaStorage {
  private requestToSchema: Map<string, Schema> = new Map<string, Schema>();

  private buildKey(path: string, method: string): string {
    return `${method.toUpperCase()}_${path.toUpperCase()}`;
  }

  public addRequestSchema(path: string, method: string, schema: Schema): void {
    this.requestToSchema.set(this.buildKey(path, method), schema);
  }

  public getRequestSchema(path: string, method: string): Schema {
    const key = this.buildKey(path, method);
    const schema = this.requestToSchema.get(key);
    if (!schema) {
      throw new BaggerSchemaDoesNotExistForKeyError();
    }
    return schema;
  }
}

export const schemaStorage = new SchemaStorage();
