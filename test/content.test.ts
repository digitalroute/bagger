import { Content } from '../lib/content';
import joi from 'joi';

describe('Content objects', () => {
  test('Simple content object can be created and compiled', () => {
    const content = new Content();
    content.add('application/json', joi.string().example('foo'));
    expect(content.compile()).toMatchSnapshot();
  });
});
