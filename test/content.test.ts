import test from 'ava';
import { Content } from '../lib/content';

test('Simple content object can be created and compiled', t => {
  const content = new Content('application/json', { type: 'string', examples: ['foo'] });

  t.snapshot(content.compile());
});
