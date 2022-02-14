import { Schema } from 'joi';
import joiToSwagger from 'joi-to-swagger';
import { SchemaObject } from 'openapi3-ts';

export const createSwaggerDefinition = (schema: Schema): SchemaObject => {
  const { swagger } = joiToSwagger(schema);
  return swagger;
};
