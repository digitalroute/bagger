import { Content } from './content';
import { Schema } from '@hapi/joi';
import { JSONSchema7 } from 'json-schema';
import { RequestBodyObject } from 'openapi3-ts';

export class BaggerRequestBody {
  private _description?: string;
  private _required: boolean = false;
  private _content: Content = new Content();
  private _schema?: Schema | JSONSchema7;

  public description(description: string): BaggerRequestBody {
    this._description = description;
    return this;
  }

  public required(required: boolean): BaggerRequestBody {
    this._required = required;
    return this;
  }

  public content(contentType: string, schema: Schema | JSONSchema7): BaggerRequestBody {
    this._content.add(contentType, schema);
    return this;
  }

  public compile(): RequestBodyObject {
    return {
      description: this._description,
      required: this._required,
      content: this._content.compile()
    };
  }
}
