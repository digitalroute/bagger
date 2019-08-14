import { ParameterObject, ParameterStyle, SchemaObject, ReferenceObject, ExampleObject } from 'openapi3-ts';
import { Content } from './content';

type ExamplesObject = {
  [param: string]: ExampleObject | ReferenceObject;
};

export class BaggerParameter {
  private settings: ParameterObject = {
    in: 'path',
    name: 'path'
  };

  public query(): BaggerParameter {
    this.settings.in = 'query';
    return this;
  }

  public path(): BaggerParameter {
    this.settings.in = 'path';
    return this;
  }

  public cookie(): BaggerParameter {
    this.settings.in = 'cookie';
    return this;
  }

  public header(): BaggerParameter {
    this.settings.in = 'header';
    return this;
  }

  public name(name: string): BaggerParameter {
    this.settings.name = name;
    return this;
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

  public content(content: Content): BaggerParameter {
    this.settings.content = content.compile();
    return this;
  }

  public compile(): ParameterObject {
    return this.settings;
  }
}
