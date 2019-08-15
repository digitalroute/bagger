import { parse as validateMediaType } from 'content-type';
import { createSwaggerDefinition } from './utils/create_swagger_definition';
import { JSONSchema7 } from 'json-schema';
import { Schema } from '@hapi/joi';
import { ContentObject } from 'openapi3-ts';

// There are no type definitions for json-schema-to-openapi-schema
// eslint-disable-next-line @typescript-eslint/no-var-requires
const toOpenApi = require('json-schema-to-openapi-schema');

export class BaggerInvalidMediaTypeError extends Error {}

export class BaggerDuplicateMediaTypeError extends Error {}

interface InternalContent {
  mediaType: string;
  schema: JSONSchema7 | Schema;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isJoi(schema: any): schema is Schema {
  return schema.isJoi;
}

export class Content {
  private internals: InternalContent[] = [];

  public add(mediaType: string, schema: JSONSchema7 | Schema): Content {
    if (!validateMediaType(mediaType)) {
      throw new BaggerInvalidMediaTypeError();
    }
    if (this.internals.some(internal => internal.mediaType === mediaType)) {
      throw new BaggerDuplicateMediaTypeError();
    }
    this.internals.push({
      mediaType,
      schema
    });
    return this;
  }

  /**
   * Creates a compiled object representation of the content.
   * @returns A Swagger content object
   */
  public compile(): ContentObject {
    const obj = this.internals.reduce((prev: ContentObject, curr: InternalContent): ContentObject => {
      prev[curr.mediaType] = {
        schema: isJoi(curr.schema) ? createSwaggerDefinition(curr.schema) : toOpenApi(curr.schema)
      };
      return prev;
    }, {});
    return obj;
  }
}
