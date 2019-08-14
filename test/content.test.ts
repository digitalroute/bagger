import { Content } from '../lib/content';

describe('Content objects', () => {
  test('Simple content object can be created and compiled', () => {
    const content = new Content();
    content.add('application/json', { type: 'string', examples: ['foo'] });
    expect(content.compile()).toMatchSnapshot();
  });
});
