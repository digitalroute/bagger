import { createSwaggerDefinition } from './utils/createSwaggerDefinition';
import { JSONSchema7 } from 'json-schema';
import { Schema } from '@hapi/joi';
import { SchemaObject } from 'openapi3-ts';
const toOpenApi = require('json-schema-to-openapi-schema');

type InternalContent = {
  mediaType: string;
  schema: SchemaObject;
};

function isJoi(schema: any): schema is Schema {
  return schema.isJoi;
}

export class Content {
  private internals: InternalContent;

  constructor(mediaType: string, schema: JSONSchema7 | Schema) {
    if (isJoi(schema)) {
      this.internals = { mediaType, schema: createSwaggerDefinition(schema) };
    } else {
      this.internals = { mediaType, schema: toOpenApi(schema) };
    }
  }

  public compile() {
    const { mediaType, schema } = this.internals;
    return {
      [mediaType]: {
        schema
      }
    };
  }
}
