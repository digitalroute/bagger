import * as bagger from '../lib/bagger';

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
      .request('/bags', 'get')
      .addTag('bags')
      .addTag('users')
      .addResponse(bagger.response(200).description('Good fetch'));
    expect(bagger.compile()).toMatchSnapshot();
  });
});
