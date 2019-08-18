# API Reference

To use bagger `bagger.configure().info(info)` has to be called before `bagger.compile()`. Every added request has to have at least one defined response.

- [`bagger.configure()`](#baggerconfigure)
  - [`.info(info)`](#infoinfo)
  - [`.addServer(server)`](##addserverserver)
  - [`.addSecurity(security)`](#addsecuritysecurity)
  - [`.externalDocs(externalDocs)`](#externaldocsexternaldocs)
- [`bagger.compile()`](#baggercompile)
- [`bagger.addRequest(path, method)`](#baggeraddrequestpath-method)
  - [`.addResponse(response)`](#addresponseresponse)
  - [`.operationId(operationId)`](#operationidoperationid)
  - [`.deprecated(deprecated)`](#deprecateddeprecated)
  - [`.summary(summary)`](#summarysummary)
  - [`.addTag(tag)`](#addtagtag)
  - [`.addSecurity(scheme, scopes)`](#addsecurityscheme-scopes)
  - [`.body(requestBody)`](#bodyrequestbody)
  - [`.addParameter(parameter)`](#addparameterparameter)
- [`bagger.addComponent()`](#baggeraddcomponent)
  - Schema WIP?
- [`bagger.response(httpCode)`](#baggerresponsehttpcode)
  - [`.description(description)`](#descriptiondescription)
  - [`.content(mediaType, schema)`](#contentmediatype-schema)
- [`bagger.requestBody()`](#baggerrequestbody)
  - [`.required(required)`](#requiredrequired)
  - [`.content(contentType, schema)`](#contentcontenttype-schema)
  - [`.getSchemas()`](#getschemas)
- [`bagger.parameter().<type>(name)`](#baggerparametertypename)
  - [`.getType()`](#gettype)
  - [`.description(description)`](#descriptiondescription-1)
  - [`.required(required)`](#requiredrequired-1)
  - [`.deprecated(deprecated)`](#deprecateddeprecated-1)
  - [`.allowEmptyValue(allowEmptyValue)`](#allowemptyvalueallowemptyvalue)
  - [`.style(style)`](#stylestyle)
  - [`.explode(explode)`](#explodeexplode)
  - [`.allowReserved(allowReserved)`](#allowreservedallowreserved)
  - [`.schema(schema)`](#schemaschema)
  - [`.examples(examples)`](#examplesexamples)
  - [`.addContent(contentType, schema)`](#addcontentcontenttype-schema)
  - [`.getSchemas()`](#getschemas-1)
- [`bagger.getRequestSchema()`](#baggergetrequestschema)

## `bagger.configure()`

Get the configuration object for bagger. This defines the configuration for all endpoints.

```js
const bagger = require('bagger');
bagger
  .configure()
  .info({
    title: 'Bagger API',
    version: 'v1',
    description: 'Provides resources to building swagger definitions'
  })
  .addServer({
    url: 'https://localhost:3000',
    description: 'Local development'
  });
```

### `.info(info)`

- `info`:

```ts
{
  title: string;
  version: string;
  description?: string;
  termsOfService?: string;
  contact?: {
    name?: string;
    url?: string;
    email?: string;
  };
  license?: {
    name: string;
    url?: string;
  };
}
```

Create the information object in an OpenAPI schema. This method has to be called before `bagger.compile()`, and it has to contain `title`, and `version`.

### `.addServer(server)`

- `server`:

```ts
{
  url: string;
  description?: string;
  variables?: {
    [v: string]: {
      enum?: string[] | boolean[] | number[];
      default: string | boolean | number;
      description?: string;
    };
  };
}
```

Add a server to the configuration. All API endpoints are relative to the base URL, which is set by this method. In OpenAPI 3.0, you use the servers array to specify one or more base URLs for your API.

Description is a markdown formatted string. If no servers are added, the server URL defaults to `/`.

Read https://swagger.io/docs/specification/api-host-and-base-path/ from more information about the field.

### `.addSecurity(security)`

- `security`: { [name: string]: string[]; }

Add an authentication component to the OpenAPI schema. These will be included in the root `security` field.

### `.externalDocs(externalDocs)`

- `externalDocs`: { url: string; description?: string; }

Define external documentation for the OpenAPI schema. This allows referencing an external resource for extended documentation.

## `bagger.compile()`

This method will compile all configuration done before the method call, and return a valid OpenAPI 3 definition. If the resulting definition for any reason is not valid it will throw. This can be used together with other tools like `swagger-ui` or `swagger-ui-express`.

```js
const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const bagger = require('@digitalroute/bagger');

bagger.configure();
// ...

bagger.addRequest('/bags', 'get');
// ...

router.get('/api-docs', swaggerUi.serve, swaggerUi.setup(bagger.compile()));
```

## `bagger.addRequest(path, method)`

### `.addResponse(response)`

### `.operationId(operationId)`

### `.deprecated(deprecated)`

### `.summary(summary)`

### `.addTag(tag)`

### `.addSecurity(scheme, scopes)`

### `.body(requestBody)`

### `.addParameter(parameter)`

## `bagger.addComponent()`

### Schema WIP?

## `bagger.response(httpCode)`

### `.description(description)`

### `.content(mediaType, schema)`

## `bagger.requestBody()`

### `.required(required)`

### `.content(contentType, schema)`

### `.getSchemas()`

## `bagger.parameter().<type>(name)`

### `.getType()`

### `.description(description)`

### `.required(required)`

### `.deprecated(deprecated)`

### `.allowEmptyValue(allowEmptyValue)`

### `.style(style)`

### `.explode(explode)`

### `.allowReserved(allowReserved)`

### `.schema(schema)`

### `.examples(examples)`

### `.addContent(contentType, schema)`

### `.getSchemas()`

## `bagger.getRequestSchema()`
