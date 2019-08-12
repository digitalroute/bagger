import test from 'ava';
import bagger from '../lib/bagger';

test('An empty definition should compile', t => {
  t.snapshot(
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
  );
});

test.todo('Add support for compiling with tags');
