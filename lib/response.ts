import { JSONSchema7 } from 'json-schema';
import { cleanObject } from './utils/clean-object';
import { Schema } from '@hapi/joi';
import { Content } from './content';
import { SchemaObject } from 'openapi3-ts';

interface Internals {
  httpCode: number;
  description?: string;
  content?: Content;
}

interface CompiledContent {
  [key: string]: {
    schema: SchemaObject;
  };
}

interface CompiledResponse {
  [httpCode: string]: {
    description?: string;
    content?: CompiledContent;
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

  public description(description: string): BaggerResponse {
    this.internals.description = description;
    return this;
  }

  public content(mediaType: string, schema: JSONSchema7 | Schema): BaggerResponse {
    this.internals.content = new Content(mediaType, schema);
    return this;
  }

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
