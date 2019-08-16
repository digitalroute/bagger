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

  public getType(): ParameterType {
    return this.settings.in;
  }

  public description(description: string): BaggerParameter {
    this.settings.description = description;
    return this;
  }

  public required(required: boolean): BaggerParameter {
    this.settings.required = required;
    return this;
  }

  public deprecated(deprecated: boolean): BaggerParameter {
    this.settings.deprecated = deprecated;
    return this;
  }

  public allowEmptyValue(allowEmptyValue: boolean): BaggerParameter {
    this.settings.allowEmptyValue = allowEmptyValue;
    return this;
  }

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
