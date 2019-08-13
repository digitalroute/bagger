import * as bagger from '../lib/bagger';
import * as joi from '@hapi/joi';

describe('Swagger Request', () => {
  test('Create a request', () => {
    const req = bagger.request();
    expect(req.isBagger).toEqual(true);
  });

  test('Set a full request object', () => {
    const req = bagger
      .request()
      .path('/some-path')
      .method('get')
      .tag('getters')
      .security('oauth2')
      .produces('application/json')
      .body(
        bagger
          .requestBody()
          .required(true)
          .contentType('application/json')
          .schema(joi.object().keys({ a: joi.string().required() }))
      )
      .compile();
    expect(req).toHaveProperty('/some-path');
    const path = req['/some-path'];
    expect(path).toHaveProperty('get');
    expect(path['get']).toHaveProperty('tags');
    expect(path['get']).toHaveProperty('security');
    expect(path['get']).toHaveProperty('produces');
  });

  test('Do not override path', () => {
    const req = bagger
      .request()
      .path('/some-path')
      .path('/not-allowed')
      .compile();
    expect(req).toHaveProperty('/some-path');
    expect(req['/some-path']).toEqual({});
    expect(req).not.toHaveProperty('/not-allowed');
    expect(Object.keys(req)).toHaveLength(1);
  });
});
