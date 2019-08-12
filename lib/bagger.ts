import { BaggerResponse } from './response';
import { BaggerRequest } from './request';

export const bagger = {
  response: () => new BaggerResponse(),
  request: () => new BaggerRequest()
};
