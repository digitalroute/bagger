import test from 'ava';
import { cleanObject } from '../lib/utils/clean-object';

test('Will not destroy a clean object', t => {
  const originalObject = {
    foo: 'foo',
    bar: 0,
    baz: [1, 2, 'foo'],
    fooz: null,
    barz: {
      foo: 'bar'
    }
  };
  t.deepEqual(cleanObject(originalObject), originalObject);
});

test('Will shallow clean', t => {
  t.deepEqual(
    cleanObject({
      foo: 'foo',
      bar: undefined
    }),
    {
      foo: 'foo'
    }
  );
});

test('Will deep clean', t => {
  t.deepEqual(
    cleanObject({
      foo: { bar: undefined }
    }),
    {
      foo: {}
    }
  );
});
