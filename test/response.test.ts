import test from 'ava';
import bagger from '../lib/bagger';
import { JSONSchema7 } from 'json-schema';
import * as joi from '@hapi/joi';

test('Creating a bagger response does return isBagger = true', t => {
  const response = bagger.response(200);
  t.is(response.isBagger, true);
});

test('Simple response can be compiled', t => {
  const response = bagger.response(200).description('Successfully fetched request');

  t.snapshot(response.compile());
});

test('Responses could have contents that have a specified type', t => {
  const schema: JSONSchema7 = {
    type: 'string',
    examples: ['foo']
  };

  const response = bagger.response(200).content('application/json', schema);

  t.deepEqual(response.compile(), {
    200: {
      content: {
        'application/json': {
          schema
        }
      }
    }
  });
});

test('Response content can be a joi-object', t => {
  const schema = joi.object().keys({
    foo: joi
      .string()
      .example('hello world')
      .default('bar')
  });

  const response = bagger.response(200).content('application/json', schema);

  t.deepEqual(response.compile(), {
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
