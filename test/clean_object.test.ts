test('First test', () => {
  expect(true).toBe(true);
});

import { cleanObject } from '../lib/utils/clean_object';

describe('Clean object', () => {
  test('Should not destroy a clean object', () => {
    const originalObject = {
      foo: 'foo',
      bar: 0,
      baz: [1, 2, 'foo'],
      fooz: null,
      barz: {
        foo: 'bar'
      }
    };
    expect(cleanObject(originalObject)).toEqual(originalObject);
  });

  test('Shallow clean', () => {
    expect(
      cleanObject({
        foo: 'foo',
        bar: undefined
      })
    ).toEqual({
      foo: 'foo'
    });
  });

  test('Deep clean', () => {
    expect(cleanObject({ foo: { bar: undefined } })).toEqual({ foo: {} });
  });
});
