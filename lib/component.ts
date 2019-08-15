import { Schema } from '@hapi/joi';
import { SchemaObject, ReferenceObject } from 'openapi3-ts';
import { createSwaggerDefinition } from './utils/create_swagger_definition';

export type ComponentType = 'schemas' | 'securitySchemes';

export interface SchemaComponentObject {
  [schema: string]: SchemaObject | ReferenceObject;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isReference(value: any): value is ReferenceObject {
  return value.$ref && typeof value.$ref === 'string';
}

export class BaggerSchemaComponent {
  private name: string;
  private schema: Schema | ReferenceObject;

  public constructor(name: string, schema: Schema) {
    this.name = name;
    this.schema = schema;
  }

  private compileValue(): SchemaObject | ReferenceObject {
    if (isReference(this.schema)) {
      return this.schema;
    } else {
      return createSwaggerDefinition(this.schema);
    }
  }

  public compile(): { name: string; schema: SchemaObject | ReferenceObject } {
    return {
      name: this.name,
      schema: this.compileValue()
    };
  }
}
