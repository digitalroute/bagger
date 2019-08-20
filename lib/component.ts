import { Schema } from '@hapi/joi';
import { SchemaObject, ReferenceObject, SecuritySchemeType, SecuritySchemeObject } from 'openapi3-ts';
import { createSwaggerDefinition } from './utils/create_swagger_definition';
import { BaggerConfigurationInternal } from './configuration';

export type ComponentType = 'schemas' | 'securitySchemes';

export interface SchemaComponentObject {
  [schema: string]: SchemaObject | ReferenceObject;
}

export interface SecuritySchemeComponentObject {
  [name: string]: SecuritySchemeObject;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isReference(value: any): value is ReferenceObject {
  return value.$ref && typeof value.$ref === 'string';
}

export class BaggerSecurityComponent {
  private key: string;
  private _name?: string;
  private type: SecuritySchemeType;
  private _scheme?: string;
  private _in?: string;
  private _openIdConnectUrl?: string;
  private _description?: string;

  public constructor(key: string, type: SecuritySchemeType) {
    this.key = key;
    this.type = type;
  }

  public scheme(scheme: string): BaggerSecurityComponent {
    this._scheme = scheme;
    return this;
  }

  public in(location: string): BaggerSecurityComponent {
    this._in = location;
    return this;
  }

  public openIdConnectUrl(openIdConnectUrl: string): BaggerSecurityComponent {
    this._openIdConnectUrl = openIdConnectUrl;
    return this;
  }

  public description(description: string): BaggerSecurityComponent {
    this._description = description;
    return this;
  }

  public name(name: string): BaggerSecurityComponent {
    this._name = name;
    return this;
  }

  public compile(): { [key: string]: SecuritySchemeObject } {
    return {
      [this.key]: {
        type: this.type,
        description: this._description,
        in: this._in,
        scheme: this._scheme,
        openIdConnectUrl: this._openIdConnectUrl,
        name: this._name
      }
    };
  }
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

  public security(component: BaggerSecurityComponent): BaggerSecurityComponent {
    this.internalConfiguration.addSecurityComponent(component);
    return component;
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
