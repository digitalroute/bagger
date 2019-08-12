import test from 'ava';
import bagger from '../lib/bagger';
import { JSONSchema7 } from 'json-schema';

test('Creating a bagger response will return isBagger = true', t => {
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
