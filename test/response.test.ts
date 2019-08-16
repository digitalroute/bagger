import * as bagger from '../lib/bagger';
import * as joi from '@hapi/joi';

describe('Swagger Response', () => {
  test('Creating a bagger response does return isBagger = true', () => {
    const response = bagger.response(200);
    expect(response.isBagger).toBe(true);
  });

  test('Simple response can be compiled', () => {
    const response = bagger.response(200).description('Successfully fetched request');

    expect(response.compile()).toMatchSnapshot();
  });

  test('Responses could have contents that have a specified type', () => {
    const schema = joi.string().example('foo');

    const response = bagger.response(200).content('application/json', schema);

    expect(response.compile()).toMatchSnapshot();
  });

  test('Response content can be a joi-object', () => {
    const schema = joi.object().keys({
      foo: joi
        .string()
        .example('hello world')
        .default('bar')
    });

    const response = bagger.response(200).content('application/json', schema);

    expect(response.compile()).toEqual({
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                foo: {
                  type: 'string',
                  example: 'hello world',
                  default: 'bar'
                }
              }
            }
          }
        }
      }
    });
  });
});
