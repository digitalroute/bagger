import { Schema } from '@hapi/joi';
const joiToSwagger = require('joi-to-swagger');

export const createSwaggerDefinition = (schema: Schema) => {
  const { swagger } = joiToSwagger(schema);
  return swagger;
};
