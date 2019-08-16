import { parse as validateMediaType } from 'content-type';
import { createSwaggerDefinition } from './utils/create_swagger_definition';
import { Schema } from '@hapi/joi';
import { ContentObject } from 'openapi3-ts';

// There are no type definitions for json-schema-to-openapi-schema
// eslint-disable-next-line @typescript-eslint/no-var-requires
const toOpenApi = require('json-schema-to-openapi-schema');

export class BaggerInvalidMediaTypeError extends Error {}

export class BaggerDuplicateMediaTypeError extends Error {}

export class BaggerSchemaNotSetForMediaType extends Error {}

interface InternalContent {
  mediaType: string;
  schema: Schema;
}

export interface ContentSchemas {
  [key: string]: Schema;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isJoi(schema: any): schema is Schema {
  return schema.isJoi;
}

export class Content {
  private internals: InternalContent[] = [];

  /**
   * Add a content object.
   * @param mediaType The media type, for example `application/json`
   * @param schema JOI Schema for this media type
   */
  public add(mediaType: string, schema: Schema): Content {
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

  public getSchemas(): ContentSchemas {
    return this.internals.reduce((prev: ContentSchemas, curr: InternalContent): ContentSchemas => {
      prev[curr.mediaType] = curr.schema;
      return prev;
    }, {});
  }

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
