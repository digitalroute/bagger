import { BaggerResponse } from './response';

type Method = 'get' | 'post' | 'patch' | 'put';

type Security = 'ApiKeyAuth' | 'someother';

type ContentType = 'application/json' | 'text/plain';

type ParameterContext = {
  name: string;
  description: string;
  in: string;
  required: boolean;
  schema: any;
};

type RequestContext = {
  path?: string;
  methods?: Set<Method>;
  tags?: string[];
  security?: Security[];
  produces?: ContentType[];
  parameters?: ParameterContext;
  responses?: Set<BaggerResponse>;
};

export class BaggerRequest {
  private context: RequestContext = {};
  public readonly isBagger = true;

  public path(path: string): BaggerRequest {
    if (!this.context.path) {
      this.context.path = path;
    } else {
      console.error('path set multiple times');
    }
    return this;
  }

  public method(method: Method): BaggerRequest {
    if (!this.context.methods) {
      this.context.methods = new Set<Method>();
    }
    this.context.methods.add(method);
    return this;
  }

  public tag(tag: string): BaggerRequest {
    return this;
  }

  public produces(contentType: string): BaggerRequest {
    return this;
  }

  private validateJoi(joi: any): boolean {
    return true;
  }

  public query(joi: any): BaggerRequest {
    this.validateJoi(joi);
    return this;
  }

  public body(joi: any): BaggerRequest {
    this.validateJoi(joi);
    return this;
  }

  public pathParams(joi: any): BaggerRequest {
    this.validateJoi(joi);
    return this;
  }

  public response(response: BaggerResponse): BaggerRequest {
    if (!this.context.responses) {
      this.context.responses = new Set<BaggerResponse>();
    }
    this.context.responses.add(response);
    return this;
  }
}
