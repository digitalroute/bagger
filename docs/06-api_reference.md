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
    - WIP I do not know what to add?
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

Defining requests is the core of Swagger and OpenAPI 3. This method call will add a request. Requests are sometimes called [paths and operations](https://swagger.io/docs/specification/paths-and-operations/) in the Swagger docs.

> **Important:** Every request has to have at least one defined response. Otherwise bagger will throw during compile.

```js
const bagger = require('@digitalroute/bagger');
const joi = require('@hapi/joi');

bagger
  .addRequest('/bags', 'get')
  .addTag('bags')
  .addTag('getters')
  .addSecurity('OAuth2')
  .addParameter(
    bagger
      .parameter()
      .query('bagSize')
      .schema(joi.string().valid(['10L', '20L', '30L'])
      .required(true)
  )
  .addResponse(
    bagger
      .response(204)
      .description('Fetched bag of given size')
  );
```

### `.addResponse(response)`

- `response`: BaggerResponse (see [`bagger.response(httpCode)`](#baggerresponsehttpcode))

Add a response definition to the request. It explains the different responses that are possible to get when using the request.

### `.operationId(operationId)`

- `operationId`: string

operationId is an optional unique string used to identify an operation. If provided, these IDs must be unique among all requests described in your API.

### `.deprecated(deprecated)`

- `deprecated`: boolean

You can mark specific requests as deprecated to indicate that they should be transitioned out of usage. Tools may handle deprecated operations in a specific way. For example, Swagger UI displays them with a different style.

By setting `deprecated` to true you indicate that the request is deprecated.

### `.summary(summary)`

- `summary`: string

A short summary of what the request does.

### `.addTag(tag)`

- `tag`: string

You can assign a list of tags to each API operation (request). Tagged operations may be handled differently by tools and libraries. For example, Swagger UI uses tags to group the displayed operations.

Read [Grouping Operations With Tags](https://swagger.io/docs/specification/grouping-operations-with-tags/) for more information.

### `.addSecurity(scheme, scopes)`

### `.body(requestBody)`

- `requestBody`: BaggerRequestBody (see [`bagger.requestBody()`](#baggerrequestbody))

Some requests accept an HTTP body and they are described with `.body()`. The structure of the body is described with a joi-schema, which can be used for validating requests in run-time.

### `.addParameter(parameter)`

- `parameter`: BaggerParameter (see [`bagger.parameter().<type>(name)`](#baggerparametertypename))

To describe parameters that are not described in the body, you add BaggerParameters to the request. The parameters that can be described are:

- path
- query
- header
- cookie

They are described in more detail under [`bagger.parameter().<type>(name)`](#baggerparametertypename), and in the [Swagger docs](https://swagger.io/docs/specification/describing-parameters/).

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
