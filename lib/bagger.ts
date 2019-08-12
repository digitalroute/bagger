import { BaggerResponse } from './response';
import { BaggerRequest } from './request';
import { SchemaObject } from 'openapi3-ts';
import { compile } from './compile';

const bagger = {
  response: (httpCode: number) => new BaggerResponse(httpCode),
  request: () => new BaggerRequest(),
  compile
};

export default bagger;
