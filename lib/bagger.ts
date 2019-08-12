import { BaggerResponse } from './response';
import { BaggerRequest } from './request';

export const bagger = {
  response: (httpCode: number) => new BaggerResponse(httpCode),
  request: () => new BaggerRequest()
};

export default bagger;
