import { parse as validateMediaType } from 'content-type';
import { createSwaggerDefinition } from './utils/create_swagger_definition';
import { Schema } from 'joi';
import { ContentObject } from 'openapi3-ts';

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
        schema: createSwaggerDefinition(curr.schema)
      };
      return prev;
    }, {});
    return obj;
  }
}
