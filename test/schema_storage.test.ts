import { SchemaStorage } from '../lib/schema_storage';
import * as joi from 'joi';

describe('Schema storage', () => {
  let schemaStorage: SchemaStorage;
  beforeAll(() => {
    schemaStorage = new SchemaStorage();
  });
  test('Throw error for key that does not exist', () => {
    expect(() => schemaStorage.getRequestSchema('a-long-dusty-road', 'put')).toThrow();
  });

  test('Add key and get schema', () => {
    const joiSchema = joi.object().keys({ roadType: 'gravel' });
    const expectedSchema = {
      body: joiSchema
    };
    schemaStorage.addRequestSchemas(
      'on-the-highway',
      'post',
      {
        'application/json': joiSchema
      },
      'body'
    );
    const schema = schemaStorage.getRequestSchema('on-the-highway', 'post');
    expect(schema).toEqual(expectedSchema);
  });

  test(`Don't add key and get schema should error`, () => {
    expect(() => schemaStorage.getRequestSchema('not-mentioned-before', 'post')).toThrowErrorMatchingInlineSnapshot(
      `"Bagger could not find the schema for key: POST_NOT-MENTIONED-BEFORE. Make sure that you define request schemas before getting them."`
    );
  });

  test('Add multiple query parameters and get concatenated schema', () => {
    const schemas: Record<string, joi.Schema> = {
      backpack: joi.string().required(),
      size: joi
        .number()
        .integer()
        .default(20),
      unit: joi.string().valid('L', 'c.c.')
    };
    const expectedSchema = {
      query: schemas
    };
    Object.keys(schemas).forEach((key): void => {
      schemaStorage.addRequestSchemas(
        'bags',
        'post',
        {
          'application/json': schemas[key]
        },
        'query',
        key
      );
    });
    const res = schemaStorage.getRequestSchema('bags', 'post');
    expect(res).toEqual(expectedSchema);
  });
});
