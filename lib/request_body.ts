import { Content, ContentSchemas } from './content';
import { Schema } from '@hapi/joi';
import { RequestBodyObject } from 'openapi3-ts';

export class BaggerUndefinedSchemaError extends Error {}

export class BaggerRequestBody {
  private _description?: string;
  private _required: boolean = false;
  private _content: Content = new Content();

  public description(description: string): BaggerRequestBody {
    this._description = description;
    return this;
  }

  public required(required: boolean): BaggerRequestBody {
    this._required = required;
    return this;
  }

  public content(contentType: string, schema: Schema): BaggerRequestBody {
    this._content.add(contentType, schema);
    return this;
  }

  public getSchemas(): ContentSchemas {
    return this._content.getSchemas();
  }

  public compile(): RequestBodyObject {
    return {
      description: this._description,
      required: this._required,
      content: this._content.compile()
    };
  }
}
