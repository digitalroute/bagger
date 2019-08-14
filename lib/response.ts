import { JSONSchema7 } from 'json-schema';
import { cleanObject } from './utils/clean_object';
import { Schema } from '@hapi/joi';
import { Content } from './content';
import { ResponsesObject } from 'openapi3-ts';

export class BaggerResponse {
  public readonly isBagger = true;
  private _content?: Content;
  private _description?: string;
  private httpCode: number;

  public constructor(httpCode: number) {
    this.httpCode = httpCode;
  }

  /**
   * Adds a description to the response.
   * @param description
   */
  public description(description: string): BaggerResponse {
    this._description = description;
    return this;
  }

  /**
   * Adds a content description to the response, if the response includes a body.
   * @param mediaType The media type of the body. Like 'application/json'
   * @param schema A schema describing the format of the returned body. It can be a JSON Schema or a joi object.
   */
  public content(mediaType: string, schema: JSONSchema7 | Schema): BaggerResponse {
    if (!this._content) {
      this._content = new Content();
    }
    this._content.add(mediaType, schema);
    return this;
  }

  /**
   * Creates a compiled object representation of the response.
   * @returns A Swagger response object
   */
  public compile(): ResponsesObject {
    const compiledPolluted = {
      [this.httpCode]: {
        description: this._description,
        content: this._content && this._content.compile()
      }
    };

    return cleanObject(compiledPolluted);
  }
}
