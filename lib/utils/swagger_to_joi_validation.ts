import { SchemaDefinition } from '../schema_storage';
import { Schema } from '@hapi/joi';

export interface JoiValidationSchema {
  body?: Schema;
  query?: Schema;
  cookies?: Schema;
  headers?: Schema;
  params?: Schema;
}

export interface ContentTypeJoiValidationSchemas {
  [contentType: string]: JoiValidationSchema;
}

export class BaggerNoSuchSwaggerSchemaTypeError extends Error {}

export function swaggerToJoiValidation(obj: SchemaDefinition): JoiValidationSchema {
  return Object.keys(obj).reduce((prev: JoiValidationSchema, curr: string) => {
    switch (curr) {
      case 'cookie':
        prev['cookies'] = obj[curr];
        break;
      case 'header':
        prev['headers'] = obj[curr];
        break;
      case 'path':
        prev['params'] = obj[curr];
        break;
      case 'body':
        prev['body'] = obj[curr];
        break;
      case 'query':
        prev['query'] = obj[curr];
        break;
      case 'discriminator':
        break;
      default:
        throw new BaggerNoSuchSwaggerSchemaTypeError();
    }
    return prev;
  }, {});
}
