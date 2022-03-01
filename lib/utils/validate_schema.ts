import Ajv from 'ajv';
import jsonDraftSchema from 'ajv/lib/refs/json-schema-draft-04.json';
import { OpenAPIObject } from 'openapi3-ts';
import * as openApi3Schema from './openapi-3.0.json';

export function validateSchema(swaggerDefinition: OpenAPIObject): Ajv.ErrorObject[] {
  const ajv = new Ajv({ allErrors: true, schemaId: 'auto' });
  ajv.addMetaSchema(jsonDraftSchema);
  const validate = ajv.compile(openApi3Schema);
  if (!validate(swaggerDefinition)) {
    return validate.errors || [];
  } else {
    return [];
  }
}
