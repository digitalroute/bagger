import { Content } from './content';
import { Schema } from '@hapi/joi';
import { JSONSchema7 } from 'json-schema';
import { ContentObject } from 'openapi3-ts';

export interface RequestBody {
  description: string;
  required: boolean;
  content?: ContentObject;
}

export class BaggerRequestBody {
  private _description?: string;
  private _required: boolean = false;
  private _contentType: string = 'application/json';
  private _schema?: Schema | JSONSchema7;

  public description(description: string): BaggerRequestBody {
    this._description = description;
    return this;
  }

  public required(required: boolean): BaggerRequestBody {
    this._required = required;
    return this;
  }

  public contentType(contentType: string): BaggerRequestBody {
    this._contentType = contentType;
    return this;
  }

  public schema(schema: Schema | JSONSchema7): BaggerRequestBody {
    this._schema = schema;
    return this;
  }

  public compile(): RequestBody {
    if (this._schema) {
      return {
        description: this._description || '',
        required: this._required,
        content: new Content(this._contentType, this._schema).compile()
      };
    }
    return { description: this._description || '', required: this._required };
  }
}
