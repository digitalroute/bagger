import { BaggerResponse } from './response';
import { BaggerRequest } from './request';
import { SchemaObject } from 'openapi3-ts';
export * from './compile';

export function response(httpCode: number): BaggerResponse {
  return new BaggerResponse(httpCode);
}

export function request(): BaggerRequest {
  return new BaggerRequest();
}
