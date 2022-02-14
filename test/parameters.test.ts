import { joi } from '../lib';
import { BaggerParameter } from '../lib/parameters';

describe('Parameters', () => {
  test('Add path parameter with schema', () => {
    const schema = joi.string().valid('backpack', 'duffel');
    const parameter = new BaggerParameter('path', 'bagType');
    parameter.schema(schema);
    expect(parameter.compile()).toMatchSnapshot();
    const actualSchema = parameter.getSchemas();
    const expectedSchema = {
      'application/json': schema
    };
    expect(actualSchema).toEqual(expectedSchema);
  });
});
