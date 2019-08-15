import * as bagger from '../lib/bagger';
import * as joi from '@hapi/joi';

describe('Bagger compiler', () => {
  const defaultInfo = {
    title: 'Bagger API',
    version: 'v1',
    description: 'Provides resources related to building swagger definitions'
  };

  test('An empty definition should compile', () => {
    bagger.configure().info(defaultInfo);
    expect(bagger.compile()).toMatchSnapshot();
  });

  test('A request can be included', () => {
    bagger.configure().info(defaultInfo);
    bagger
      .addRequest('/bags', 'get')
      .addTag('bags')
      .addTag('users')
      .addResponse(bagger.response(200).description('Good fetch'));
    expect(bagger.compile()).toMatchSnapshot();
  });

  test('Add a request and get the schema', () => {
    bagger.configure().info(defaultInfo);
    const schema = joi.object().keys({
      bagType: joi
        .string()
        .valid(['backpack', 'sportsbag'])
        .required()
    });
    bagger
      .addRequest('/bags', 'post')
      .addTag('bags')
      .body(bagger.requestBody().content('application/json', schema))
      .addResponse(bagger.response(200).description('Bought a bag!'));
    expect(bagger.getRequestSchema('/bags', 'post')).toEqual(schema);
    expect(bagger.compile()).toMatchSnapshot();
  });
});
