import { parse as validateMediaType } from 'content-type';
import { createSwaggerDefinition } from './utils/create_swagger_definition';
import { Schema } from '@hapi/joi';
import { ContentObject } from 'openapi3-ts';

export class BaggerInvalidMediaTypeError extends Error {}

export class BaggerDuplicateMediaTypeError extends Error {}

interface InternalContent {
  mediaType: string;
  schema: Schema;
}

export class Content {
  private internals: InternalContent[] = [];

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

  /**
   * Creates a compiled object representation of the content.
   * @returns A Swagger content object
   */
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
