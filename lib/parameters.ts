import { ParameterObject, ParameterStyle, ReferenceObject, ExampleObject } from 'openapi3-ts';
import { Content, ContentSchemas } from './content';
import { Schema } from '@hapi/joi';
import { createSwaggerDefinition } from './utils/create_swagger_definition';

class BaggerContentDefinedForParameterError extends Error {}
class BaggerSchemaDefinedForParameterError extends Error {}

interface ExamplesObject {
  [param: string]: ExampleObject | ReferenceObject;
}

export type ParameterType = 'path' | 'query' | 'cookie' | 'header';

export class BaggerParameter {
  private settings: ParameterObject;
  private _content: Content = new Content();
  private _schema?: Schema;

  public constructor(type: ParameterType, name: string) {
    this.settings = { in: type, name };
  }

  /**
   * Returns the type of this parameter. E.g. where the parameter is located.
   */
  public getType(): ParameterType {
    return this.settings.in;
  }
  
  /**
   * Describe the parameter.
   * @param description the description of the parameter.
   */
  public description(description: string): BaggerParameter {
    this.settings.description = description;
    return this;
  }

  /**
   * Marks if the parameter has to be present or not.
   * @param required if the parameter has to be present or not.
   */
  public required(required: boolean): BaggerParameter {
    this.settings.required = required;
    return this;
  }

  /**
   * Marks a parameer as deprecated if set to `true`
   * @param deprecated
   */
  public deprecated(deprecated: boolean): BaggerParameter {
    this.settings.deprecated = deprecated;
    return this;
  }

  /**
   * Query string parameters may only have a name and no value, like:
   * ```
   * GET /foo?metadata
   * ```
   *
   * This marks if an empty value is allowed or not.
   * @param allowEmptyValue if empty values are allowed.
   */
  public allowEmptyValue(allowEmptyValue: boolean): BaggerParameter {
    this.settings.allowEmptyValue = allowEmptyValue;
    return this;
  }

  /**
   * Parameters containing arrays and objects can be serialized in different ways. Style defines how multiple values are delimited.
   * @param style the style for delimiting parameter. Read more at: https://swagger.io/docs/specification/serialization/
   */
  public style(style: ParameterStyle): BaggerParameter {
    this.settings.style = style;
    return this;
  }

  /**
   * Parameters containing arrays and objects can be serialized in different ways.
   * Explode specifies whether arrays and objects should generate separate parameters for each array item or object property.
   * Read more at: https://swagger.io/docs/specification/serialization/
   * @param explode specifies whether arrays and objects should generate separate parameters for each array item or object property.
   */
  public explode(explode: boolean): BaggerParameter {
    this.settings.explode = explode;
    return this;
  }

  public allowReserved(allowReserved: boolean): BaggerParameter {
    this.settings.allowReserved = allowReserved;
    return this;
  }

  public schema(schema: Schema): BaggerParameter {
    if (Object.keys(this._content.getSchemas()).length > 0) {
      throw new BaggerContentDefinedForParameterError();
    }
    this._schema = schema;
    return this;
  }

  public examples(examples: ExamplesObject): BaggerParameter {
    this.settings.examples = examples;
    return this;
  }

  public addContent(contentType: string, schema: Schema): BaggerParameter {
    if (this.settings.schema) {
      throw new BaggerSchemaDefinedForParameterError();
    }
    this._content.add(contentType, schema);
    return this;
  }

  public getSchemas(): ContentSchemas {
    if (this._schema) {
      return {
        'application/json': this._schema
      };
    }
    return this._content.getSchemas();
  }

  public compile(): ParameterObject {
    if (this._schema) {
      this.settings.schema = {
        'application/json': {
          schema: createSwaggerDefinition(this._schema)
        }
      };
    } else {
      this.settings.content = this._content.compile();
    }
    return this.settings;
  }
}
