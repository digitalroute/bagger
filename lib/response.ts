import { JSONSchema7 } from 'json-schema';
import { cleanObject } from './utils/clean-object';
import { Schema } from '@hapi/joi';
import { createSwaggerDefinition } from './utils/createSwaggerDefinition';

type InternalContent = {
  mediaType: string;
  schema: any;
};

type Internals = {
  httpCode: number;
  description?: string;
  content?: InternalContent;
};

type CompiledContent = {
  [key: string]: {
    schema: any;
  };
};

type CompiledResponse = {
  [httpCode: string]: {
    description?: string;
    content?: CompiledContent;
  };
};

function isJoi(schema: any): schema is Schema {
  return schema.isJoi;
}

export class BaggerResponse {
  public readonly isBagger = true;
  public internals: Internals;

  constructor(httpCode: number) {
    this.internals = {
      httpCode
    };
  }

  public description(description: string): BaggerResponse {
    this.internals.description = description;
    return this;
  }

  public content(mediaType: string, schema: JSONSchema7 | Schema): BaggerResponse {
    if (isJoi(schema)) {
      this.internals.content = { mediaType, schema: createSwaggerDefinition(schema) };
    } else {
      this.internals.content = { mediaType, schema };
    }
    return this;
  }

  private static compileContent(content: InternalContent | undefined): CompiledContent | undefined {
    if (content === undefined) {
      return undefined;
    }
    const { mediaType, schema } = content;
    return {
      [mediaType]: {
        schema
      }
    };
  }

  public compile(): CompiledResponse {
    const compiledPolluted = {
      [this.internals.httpCode]: {
        description: this.internals.description,
        content: BaggerResponse.compileContent(this.internals.content)
      }
    };

    return cleanObject(compiledPolluted);
  }
}
