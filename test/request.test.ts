import test from 'ava';
import bagger from '../lib/bagger';

test('Create a request', t => {
  const req = bagger.request();
  t.is(req.isBagger, true);
});
