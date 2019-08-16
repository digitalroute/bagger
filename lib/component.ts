import { Schema } from '@hapi/joi';
import { SchemaObject, ReferenceObject } from 'openapi3-ts';
import { createSwaggerDefinition } from './utils/create_swagger_definition';
import { BaggerConfigurationInternal } from './configuration';

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

  public getName(): string {
    return this.name;
  }

  public getSchema(): Schema | ReferenceObject {
    return this.schema;
  }

  public compile(): { name: string; schema: SchemaObject | ReferenceObject } {
    return {
      name: this.name,
      schema: this.compileValue()
    };
  }
}

export class BaggerComponentAdder {
  private internalConfiguration: BaggerConfigurationInternal;

  public constructor(internalConfiguration: BaggerConfigurationInternal) {
    this.internalConfiguration = internalConfiguration;
  }

  /**
   * Add a reusable data model (schema).
   * @param name A unique id that is used to referance the component.
   * @param schema A `hapi/joi` schema that describes the data model.
   */
  public schema(name: string, schema: Schema): BaggerSchemaComponent {
    const component = new BaggerSchemaComponent(name, schema);
    this.internalConfiguration.addSchemaComponent(component);
    return component;
  }
}

export class BaggerComponentGetter {
  private internalConfiguration: BaggerConfigurationInternal;

  public constructor(internalConfiguration: BaggerConfigurationInternal) {
    this.internalConfiguration = internalConfiguration;
  }

  public getSchema(name: string): Schema {
    return this.internalConfiguration.getSchemaComponent(name);
  }
}
