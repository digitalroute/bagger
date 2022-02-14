import { Content, ContentSchemas } from './content';
import { Schema } from 'joi';
import { RequestBodyObject } from 'openapi3-ts';

export class BaggerUndefinedSchemaError extends Error {}

export class BaggerRequestBody {
  private _description?: string;
  private _required: boolean = false;
  private _content: Content = new Content();

  /**
   * Set the description of the request body. It can be markdown-formatted.
   * @param description The description of the request body.
   */
  public description(description: string): BaggerRequestBody {
    this._description = description;
    return this;
  }

  /**
   * Request bodies are optional by default. To mark the body as required, use required: `true`.
   * @param required if the request body is required.
   */
  public required(required: boolean): BaggerRequestBody {
    this._required = required;
    return this;
  }

  /**
   * Content describes the content of a body.
   * @param mediaType The media type of the content. Like 'application/json' or 'text/plain'. See https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types for more information
   * @param schema A `joi` schema describing the content of the body. This can also be used for validating requests in run time by using `.getSchema()`.
   */
  public content(mediaType: string, schema: Schema): BaggerRequestBody {
    this._content.add(mediaType, schema);
    return this;
  }

  /**
   * Get the `joi` schemas that is used to describe the body content. It can be used for validating requests in runtime.
   */
  public getSchemas(): ContentSchemas {
    return this._content.getSchemas();
  }

  /**
   * Creates a compiled object representation of the request body.
   */
  public compile(): RequestBodyObject {
    return {
      description: this._description,
      required: this._required,
      content: this._content.compile()
    };
  }
}
