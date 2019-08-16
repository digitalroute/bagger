import { ParameterObject, ParameterStyle, SchemaObject, ReferenceObject, ExampleObject } from 'openapi3-ts';
import { Content, ContentSchemas } from './content';
import { Schema } from '@hapi/joi';

interface ExamplesObject {
  [param: string]: ExampleObject | ReferenceObject;
}

export type ParameterType = 'path' | 'query' | 'cookie' | 'header';

export class BaggerParameter {
  private settings: ParameterObject;
  private _content: Content = new Content();

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
   * Add a description for this parameter.
   * @param description
   */
  public description(description: string): BaggerParameter {
    this.settings.description = description;
    return this;
  }

  /**
   * Sets if this parameter is required or not.
   * @param required
   */
  public required(required: boolean): BaggerParameter {
    this.settings.required = required;
    return this;
  }

  /**
   * Sets if this parameter is deprecated or not.
   * @param deprecated
   */
  public deprecated(deprecated: boolean): BaggerParameter {
    this.settings.deprecated = deprecated;
    return this;
  }

  /**
   * Set allowEmptyValue if the parameter is allowed to be empty or not.
   * @param allowEmptyValue
   */
  public allowEmptyValue(allowEmptyValue: boolean): BaggerParameter {
    this.settings.allowEmptyValue = allowEmptyValue;
    return this;
  }

  /**
   * Sets the style of the parameter.
   * @param style
   */
  public style(style: ParameterStyle): BaggerParameter {
    this.settings.style = style;
    return this;
  }

  public explode(explode: boolean): BaggerParameter {
    this.settings.explode = explode;
    return this;
  }

  public allowReserved(allowReserved: boolean): BaggerParameter {
    this.settings.allowReserved = allowReserved;
    return this;
  }

  public schema(schema: SchemaObject | ReferenceObject): BaggerParameter {
    this.settings.schema = schema;
    return this;
  }

  public examples(examples: ExamplesObject): BaggerParameter {
    this.settings.examples = examples;
    return this;
  }

  public addContent(contentType: string, schema: Schema): BaggerParameter {
    this._content.add(contentType, schema);
    return this;
  }

  public getSchemas(): ContentSchemas {
    return this._content.getSchemas();
  }

  public compile(): ParameterObject {
    this.settings.content = this._content.compile();
    return this.settings;
  }
}
