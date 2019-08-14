import * as bagger from '../lib/bagger';
import * as joi from '@hapi/joi';

describe('Swagger Request', () => {
  test('Set a full request object', () => {
    const req = bagger
      .request('/some-path', 'get')
      .addTag('getters')
      .addSecurity('oauth2')
      .body(
        bagger
          .requestBody()
          .required(true)
          .content('application/json', joi.object().keys({ a: joi.string().required() }))
      )
      .compile();
    expect(req).toHaveProperty('/some-path');
    const path = req['/some-path'];
    expect(path).toHaveProperty('get');
    expect(path['get']).toHaveProperty('tags');
    expect(path['get']).toHaveProperty('security');
  });
});
