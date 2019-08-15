import { schemaStorage } from '../lib/schema_storage';
import * as joi from '@hapi/joi';

describe('Schema storage', () => {
  test('Throw error for key that does not exist', () => {
    expect(() => schemaStorage.getRequestSchema('a_long_dusty_road', 'put')).toThrow();
  });

  test('Add key and get schema', () => {
    const expectedSchema = joi.object().keys({ roadType: 'gravel' });
    schemaStorage.addRequestSchema('on-the-highway', 'post', expectedSchema);
    const schema = schemaStorage.getRequestSchema('on-the-highway', 'post');
    expect(schema).toEqual(expectedSchema);
  });
});
