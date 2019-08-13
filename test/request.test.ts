import * as bagger from '../lib/bagger';

describe('Swagger Request', () => {
  test('Create a request', () => {
    const req = bagger.request();
    expect(req.isBagger).toEqual(true);
  });
});
