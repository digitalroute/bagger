import { parse as validateMediaType } from 'content-type';
import { createSwaggerDefinition } from './utils/createSwaggerDefinition';
import { JSONSchema7 } from 'json-schema';
import { Schema } from '@hapi/joi';
import { SchemaObject, ContentObject, MediaTypeObject } from 'openapi3-ts';

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
  private internals: InternalContent[] = [];

  public add(mediaType: string, schema: JSONSchema7 | Schema): Content {
    if (!validateMediaType(mediaType)) {
      console.error(`${mediaType} is not a valid media type`);
      return this;
    }
    if (this.internals.some(internal => internal.mediaType === mediaType)) {
      console.error('media type already added');
      return this;
    }
    this.internals.push({
      mediaType,
      schema: isJoi(schema) ? createSwaggerDefinition(schema) : toOpenApi(schema)
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
        schema: curr.schema
      };
      return prev;
    }, {});
    return obj;
  }
}
