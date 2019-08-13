import * as bagger from '../lib/bagger';

describe('Bagger compiler', () => {
  test('An empty definition should compile', () => {
    expect(
      bagger.compile(
        {
          info: {
            title: 'Bagger API',
            version: 'v1',
            description: 'Provides resources related to building swagger definitions'
          }
        },
        []
      )
    ).toMatchSnapshot();
  });
});
