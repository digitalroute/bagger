import { schemaStorage } from '../lib/schema_storage';
import * as joi from '@hapi/joi';

describe('Schema storage', () => {
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
});
