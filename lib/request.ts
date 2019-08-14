import { BaggerResponse } from './response';
import { BaggerRequestBody } from './request_body';
import {
  OperationObject,
  SecurityRequirementObject,
  RequestBodyObject,
  ExternalDocumentationObject,
  ParameterObject,
  ReferenceObject,
  ResponsesObject,
  CallbacksObject,
  ServerObject,
  PathsObject
} from 'openapi3-ts';

export type Method = 'get' | 'post' | 'patch' | 'put' | 'delete' | 'options' | 'head' | 'trace';

type OperationTypes =
  | string
  | ExternalDocumentationObject
  | ParameterObject[]
  | ReferenceObject[]
  | RequestBodyObject
  | ReferenceObject
  | ResponsesObject
  | CallbacksObject
  | boolean
  | SecurityRequirementObject[]
  | ServerObject;

export class BaggerRequest {
  private path: string;
  private method: Method;
  private operationContext: OperationObject = {
    responses: {}
  };
  public readonly isBagger = true;

  public constructor(path: string, method: Method) {
    this.path = path;
    this.method = method;
  }

  private setInContext(key: string, value: OperationTypes): void {
    if (!this.operationContext[key]) {
      this.operationContext[key] = value;
    }
  }

  public operationId(operationId: string): BaggerRequest {
    this.setInContext('operationId', operationId);
    return this;
  }

  public deprecated(deprecated: boolean): BaggerRequest {
    this.setInContext('deprecated', deprecated);
    return this;
  }

  public addTag(tag: string): BaggerRequest {
    if (!this.operationContext.tags) {
      this.operationContext.tags = [];
    }
    this.operationContext.tags.push(tag);
    return this;
  }

  public security(scheme: string, scopes: string[] = []): BaggerRequest {
    if (!this.operationContext.security) {
      this.operationContext.security = [];
    }
    const obj: SecurityRequirementObject = {};
    obj[scheme] = scopes;
    this.operationContext.security.push(obj);
    return this;
  }

  public body(requestBody: BaggerRequestBody): BaggerRequest {
    this.setInContext('requestBody', requestBody.compile());
    return this;
  }

  public response(response: BaggerResponse): BaggerRequest {
    if (!this.operationContext.responses) {
      this.operationContext.responses = [];
    }
    this.operationContext.responses.push(response.compile());
    return this;
  }

  public compile(): PathsObject {
    return {
      [this.path]: {
        [this.method]: this.operationContext
      }
    };
  }
}
