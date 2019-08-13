import * as bagger from '../lib/bagger';

describe('Swagger Request', () => {
  test('Create a request', () => {
    const req = bagger.request();
    expect(req.isBagger).toEqual(true);
  });
  test('Set path', t => {
    const req = bagger
      .request()
      .path('/hej')
      .compile();
    t.assert(req.path, '/hej');
  });
});
