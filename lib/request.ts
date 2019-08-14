import { parse as validateContentType } from 'content-type';
import { BaggerResponse } from './response';
import { RequestBody, BaggerRequestBody } from './request_body';
import { PathItemObject } from 'openapi3-ts';

type Method = 'get' | 'post' | 'patch' | 'put' | 'delete' | 'options' | 'head' | 'trace' | 'connect';

interface RequestContext {
  path: string;
  summary?: string;
  description?: string;
  methods: Set<Method>;
  tags: Set<string>;
  security: Set<string>;
  produces: Set<string>;
  requestBody?: RequestBody | BaggerRequestBody;
  responses?: Set<BaggerResponse>;
}

interface CompiledMethodContent {
  summary?: string;
  description?: string;
  tags?: Set<string>;
  security?: Set<string>;
  produces?: Set<string>;
  requestBody?: RequestBody | BaggerRequestBody;
  responses?: Set<BaggerResponse>;
}

export interface CompiledRequest {
  [path: string]: {
    [method in Method]: CompiledMethodContent;
  };
}

export class BaggerRequest {
  /*private _path: string = '';
  private pathContext: PathItemObject;*/
  private context: RequestContext = {
    // TODO: Use open api types
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

  public body(requestBody: RequestBody | BaggerRequestBody): BaggerRequest {
    if (!this.context.requestBody) {
      this.context.requestBody = requestBody;
    } else {
      console.error('request body set multiple times');
    }
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
    const obj: PathItemObject = {};
    obj[this.context.path] = {};
    /* eslint-disable */
    const v: any = this.context as CompiledMethodContent;
    this.context.methods.forEach((value: Method, _: Method, _set: Set<Method>) => {
      const newVal = Object.keys(v).reduce(
        (prev, curr) => {
          let val = v[curr];
          if (typeof v[curr].compile === 'function') {
            val = v[curr].compile();
          } else if (v[curr] instanceof Set) {
            val = Array.from(v[curr]);
          }
          prev[curr] = val;
          return prev;
        },
        {} as any
      );
      obj[this.context.path][value] = newVal;
    });
    /* eslint-enable */
    return obj;
  }
}
