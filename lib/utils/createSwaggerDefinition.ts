import { Schema } from '@hapi/joi';
import { SchemaObject } from 'openapi3-ts';

// The type definitions for joi-to-swagger are wrong and create type errors
// eslint-disable-next-line @typescript-eslint/no-var-requires
const joiToSwagger = require('joi-to-swagger');

export const createSwaggerDefinition = (schema: Schema): SchemaObject => {
  const { swagger } = joiToSwagger(schema);
  return swagger;
};
