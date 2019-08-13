import { JSONSchema7 } from 'json-schema';
import { cleanObject } from './utils/clean_object';
import { Schema } from '@hapi/joi';
import { Content } from './content';
import { ContentObject } from 'openapi3-ts';

interface Internals {
  httpCode: number;
  description?: string;
  content?: Content;
}

interface CompiledResponse {
  [httpCode: string]: {
    description?: string;
    content?: ContentObject;
  };
}

export class BaggerResponse {
  public readonly isBagger = true;
  public internals: Internals;

  public constructor(httpCode: number) {
    this.internals = {
      httpCode
    };
  }

  /**
   * Adds a description to the response.
   * @param description
   */
  public description(description: string): BaggerResponse {
    this.internals.description = description;
    return this;
  }

  /**
   * Adds a content description to the response, if the response includes a body.
   * @param mediaType The media type of the body. Like 'application/json'
   * @param schema A schema describing the format of the returned body. It can be a JSON Schema or a joi object.
   */
  public content(mediaType: string, schema: JSONSchema7 | Schema): BaggerResponse {
    this.internals.content = new Content(mediaType, schema);
    return this;
  }

  /**
   * Creates a compiled object representation of the response.
   * @returns A Swagger response object
   */
  public compile(): CompiledResponse {
    const compiledPolluted = {
      [this.internals.httpCode]: {
        description: this.internals.description,
        content: this.internals.content && this.internals.content.compile()
      }
    };

    return cleanObject(compiledPolluted);
  }
}
