import { BaggerResponse } from './response';
import { BaggerRequest } from './request';
export * from './compile';

export function response(httpCode: number): BaggerResponse {
  return new BaggerResponse(httpCode);
}

export function request(): BaggerRequest {
  return new BaggerRequest();
}
