import { parse as validateContentType } from 'content-type';
import { BaggerResponse } from './response';
import { JoiObject } from '@hapi/joi';

type Method = 'get' | 'post' | 'patch' | 'put' | 'delete' | 'options' | 'head' | 'trace' | 'connect';

type ParameterContext = {
  name: string;
  description: string;
  in: string;
  required: boolean;
  schema: any;
};

type RequestContext = {
  path: string;
  summary?: string;
  description?: string;
  methods: Set<Method>;
  tags: Set<string>;
  security: Set<string>;
  produces: Set<string>;
  parameters?: ParameterContext[];
  responses?: Set<BaggerResponse>;
};

type CompiledMethodContent = {
  summary?: string;
  description: string;
  tags?: Set<string>;
  security?: Set<string>;
  produces?: Set<string>;
  parameters?: ParameterContext[];
  responses: Set<BaggerResponse>;
};

type CompiledRequest = {
  [path: string]: {
    [method in Method]: CompiledMethodContent;
  };
};

export class BaggerRequest {
  private context: RequestContext = {
    path: '', // TODO: should not have default value
    methods: new Set<Method>(),
    tags: new Set<string>(),
    security: new Set<string>(),
    produces: new Set<string>()
  };
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
    if (!this.context.tags) {
      this.context.tags = new Set<string>();
    }
    this.context.tags.add(tag);
    return this;
  }

  public security(scheme: string): BaggerRequest {
    if (!this.context.security) {
      this.context.security = new Set<string>();
    }
    this.context.security.add(scheme);
    return this;
  }

  public produces(contentType: string): BaggerRequest {
    if (!this.context.produces) {
      this.context.produces = new Set<string>();
    }
    try {
      validateContentType(contentType);
      this.context.produces.add(contentType);
    } catch (err) {
      console.error('invalid content type', err);
    }
    return this;
  }

  public query(joi: JoiObject): BaggerRequest {
    return this;
  }

  public body(joi: JoiObject): BaggerRequest {
    return this;
  }

  public pathParams(joi: JoiObject): BaggerRequest {
    return this;
  }

  public response(response: BaggerResponse): BaggerRequest {
    if (!this.context.responses) {
      this.context.responses = new Set<BaggerResponse>();
    }
    this.context.responses.add(response);
    return this;
  }

  public compile(): CompiledRequest {
    const obj: any = {};
    const ctxt: any = (obj[this.context.path] = {});
    const v = this.context as CompiledMethodContent;
    this.context.methods.forEach((value: Method, _: Method, _set: Set<Method>) => {
      ctxt[value] = v;
    });
    return obj;
  }
}
