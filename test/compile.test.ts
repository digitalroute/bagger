import * as bagger from '../lib/bagger';

describe('Bagger compiler', () => {
  const defaultInfo = {
    title: 'Bagger API',
    version: 'v1',
    description: 'Provides resources related to building swagger definitions'
  };

  test('An empty definition should compile', () => {
    expect(
      bagger.compile(
        {
          info: defaultInfo
        },
        []
      )
    ).toMatchSnapshot();
  });

  test('A request can be included', () => {
    expect(
      bagger.compile(
        {
          info: defaultInfo
        },
        [
          bagger
            .request('/bags', 'get')
            .addTag('bags')
            .addTag('users')
        ]
      )
    ).toMatchSnapshot();
  });
});
