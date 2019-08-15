import { BaggerResponse } from './response';
import { BaggerRequestBody } from './request_body';
import { BaggerParameter } from './parameters';
import { schemaStorage } from './schema_storage';
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

  private setInContext(key: keyof OperationObject, value: OperationTypes): BaggerRequest {
    if (!this.operationContext[key]) {
      this.operationContext[key] = value;
    }
    return this;
  }

  public operationId(operationId: string): BaggerRequest {
    return this.setInContext('operationId', operationId);
  }

  public deprecated(deprecated: boolean): BaggerRequest {
    return this.setInContext('deprecated', deprecated);
  }

  public summary(summary: string): BaggerRequest {
    return this.setInContext('summary', summary);
  }

  public addTag(tag: string): BaggerRequest {
    if (!this.operationContext.tags) {
      this.operationContext.tags = [];
    }
    this.operationContext.tags.push(tag);
    return this;
  }

  public addSecurity(scheme: string, scopes: string[] = []): BaggerRequest {
    if (!this.operationContext.security) {
      this.operationContext.security = [];
    }
    const obj: SecurityRequirementObject = {};
    obj[scheme] = scopes;
    this.operationContext.security.push(obj);
    return this;
  }

  public body(requestBody: BaggerRequestBody): BaggerRequest {
    schemaStorage.addRequestSchema(this.path, this.method, requestBody.getSchema());
    return this.setInContext('requestBody', requestBody.compile());
  }

  public addParameter(parameter: BaggerParameter): BaggerRequest {
    if (!this.operationContext.parameters) {
      this.operationContext.parameters = [];
    }
    this.operationContext.parameters.push(parameter.compile());
    return this;
  }

  public addResponse(response: BaggerResponse): BaggerRequest {
    if (!this.operationContext.responses) {
      this.operationContext.responses = {};
    }

    const responseDefinition = response.compile();

    this.operationContext.responses = {
      ...responseDefinition,
      ...this.operationContext.responses
    };
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
