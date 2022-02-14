import bagger from '../lib/bagger';
import * as joi from 'joi';

describe('Swagger Request', () => {
  test('Set a full request object', () => {
    const req = bagger
      .addRequest('/some-path', 'get')
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
    expect(path['get']).toHaveProperty('requestBody');
  });

  test('Use parameters in request', () => {
    const req = bagger
      .addRequest('/some-path', 'get')
      .addTag('getters')
      .addSecurity('oauth2')
      .addParameter(
        bagger
          .parameter()
          .query('a query param')
          .required(true)
      )
      .compile();
    expect(req).toHaveProperty('/some-path');
    const path = req['/some-path'];
    expect(path).toHaveProperty('get');
    expect(path.get).toHaveProperty('tags');
    expect(path.get).toHaveProperty('security');
    expect(path.get).toHaveProperty('parameters');
    expect(path.get.parameters).toHaveLength(1);
    expect(path.get.parameters[0]).toHaveProperty('in');
    expect(path.get.parameters[0].in).toEqual('query');
    expect(path.get.parameters[0]).toHaveProperty('name');
    expect(path.get.parameters[0].name).toEqual('a query param');
    expect(path.get.parameters[0]).toHaveProperty('required');
    expect(path.get.parameters[0].required).toEqual(true);
  });
});
