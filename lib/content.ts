import { createSwaggerDefinition } from './utils/createSwaggerDefinition';
import { JSONSchema7 } from 'json-schema';
import { Schema } from '@hapi/joi';
import { SchemaObject, ContentObject } from 'openapi3-ts';

// There are no type definitions for json-schema-to-openapi-schema
// eslint-disable-next-line @typescript-eslint/no-var-requires
const toOpenApi = require('json-schema-to-openapi-schema');

interface InternalContent {
  mediaType: string;
  schema: SchemaObject;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isJoi(schema: any): schema is Schema {
  return schema.isJoi;
}

export class Content {
  private internals: InternalContent;

  public constructor(mediaType: string, schema: JSONSchema7 | Schema) {
    if (isJoi(schema)) {
      this.internals = { mediaType, schema: createSwaggerDefinition(schema) };
    } else {
      this.internals = { mediaType, schema: toOpenApi(schema) };
    }
  }

  public compile(): ContentObject {
    const { mediaType, schema } = this.internals;
    return {
      [mediaType]: {
        schema
      }
    };
  }
}
