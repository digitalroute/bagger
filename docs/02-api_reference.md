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
  - [`.description(description)`](#descriptiondescription-1)
  - [`.required(required)`](#requiredrequired)
  - [`.content(contentType, schema)`](#contentcontenttype-schema)
  - [`.getSchemas()`](#getschemas)
- [`bagger.parameter().<type>(name)`](#baggerparametertypename)
  - [`.getType()`](#gettype)
  - [`.description(description)`](#descriptiondescription-2)
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
const bagger = require('bagger').default;
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
const bagger = require('@digitalroute/bagger').default;

bagger.configure();
// ...

bagger.addRequest('/bags', 'get');
// ...

router.get('/api-docs', swaggerUi.serve, swaggerUi.setup(bagger.compile()));
```

## `bagger.addRequest(path, method)`

- `path`: `string`
- `method`: `'get'` | `'post'` | `'patch'` | `'put'` | `'delete'` | `'options'` | `'head'` | `'trace'`

Defining requests is the core of Swagger and OpenAPI 3. This method call will add a request. Requests are sometimes called [paths and operations](https://swagger.io/docs/specification/paths-and-operations/) in the Swagger docs.

> **Important:** Every request has to have at least one defined response. Otherwise bagger will throw during compile.

```js
const bagger = require('@digitalroute/bagger').default;
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

- `httpCode`: number

All requests have to have at least one defined response. This returns a response object that can be used to describe different possible responses to requests. The `httpCode` is used to describe what the HTTP Code of the response will be.

Read [Describing Responses](https://swagger.io/docs/specification/describing-responses/) for more information.

```js
const bagger = require('@digitalroute/bagger').default;
const joi = require('@hapi/joi');

const successfulResponse = bagger
  .response(200)
  .description('A JSON object containing bags')
  .content(
    'application/json',
    joi.array().items(
      joi.object.keys({
        color: joi.string(),
        name: joi.string()
      })
    )
  );

const badResponse = bagger.response(400).description('Bad request');

bagger
  .addRequest('/bags', 'get')
  .addResponse(successfulResponse)
  .addResponse(badResponse);
```

### `.description(description)`

- `description`: string

Every response requires a description that describes the response. Markdown ([CommonMark](https://commonmark.org/help/)) can be used for rich text representation.

### `.content(mediaType, schema)`

- `mediaType`: string
- `schema`: Joi.Schema ([link](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b8183c0147e7412a4e0414a5456441789473b4d8/types/hapi__joi/index.d.ts#L304))

Responses can have a response body. They are described with `content()`. The media type describes the format of the response body. Examples are:

- `application/json`
- `application/xml`
- `text/plain`

The schema describes the format of the body. Bagger uses joi schemas and translates them into OpenAPI 3 schemas.

## `bagger.requestBody()`

Create a request body used for defining a body in a bagger request.

```js
const bagger = require('.');
const joi = require('@hapi/joi');

const body = bagger
  .requestBody()
  .description('Create a bag')
  .content(
    'application/json',
    joi.object().keys({
      type: joi
        .string()
        .valid(['backpack', 'duffel', 'sports'])
        .required(),
      size: joi
        .array()
        .items(
          joi
            .string()
            .valid(['10L', '20L', '30L'])
            .required()
        )
        .required(),
      description: joi.string().optional()
    })
  )
  .required(true);

bagger.addRequest('/bags', 'post').body(body);
```

### `.description(description)`

- `description`: string

Set the description of the request body. Markdown ([CommonMark](https://commonmark.org/help/)) can be used for rich text representation.

### `.required(required)`

- `required`: boolean

Request bodies are optional by default. To mark the body as required, use required: `true`.

### `.content(contentType, schema)`

- `contentType`: string
- `schema`: Joi.Schema ([link](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b8183c0147e7412a4e0414a5456441789473b4d8/types/hapi__joi/index.d.ts#L304))

Requests can have a requests body. They are described with `content()`. The media type describes the format of the response body. Examples are:

- `application/json`
- `application/xml`
- `text/plain`

The schema describes the format of the body. Bagger uses joi schemas and translates them into OpenAPI 3 schemas.

### `.getSchemas()`

WIP

## `bagger.parameter().<type>(name)`

- `type`: `'path'` | `'query'` | `'cookie'` | `'header'`
- `name`: `string`

Create a parameter used for defining query, path, cookie or header parameter in bagger requests.

```js
const bagger = require('bagger').default;

const parameter = bagger
  .parameter()
  .path('bagId')
  .schema(joi.string().required())
  .description('ID of one bag')
  .explode(true)
  .required(true);

bagger.addRequest('/bags/{bagId}', 'get').addParameter(parameter);
```

### `.getType()`

Returns the name of this parameter.

### `.description(description)`

- `description`: `string`

Adds a description of the parameter.

### `.required(required)`

- `required`: `boolean`

Marks if the parameter has to be present or not.

### `.deprecated(deprecated)`

- `deprecated`: `boolean`

Marks a parameer as deprecated if set to `true`

### `.allowEmptyValue(allowEmptyValue)`

- `allowEmptyValue`: `boolean`

Query string parameters may only have a name and no value, like:

```
GET /foo?metadata
```

This marks if an empty value is allowed or not.

### `.style(style)`

- `style`: `'matrix'` | `'label'` | `'form'` | `'simple'` | `'spaceDelimited'` | `'pipeDelimited'` | `'deepObject'`

Parameters containing arrays and objects can be serialized in different ways. Style defines how multiple values are delimited.
Read more at: [https://swagger.io/docs/specification/serialization/](https://swagger.io/docs/specification/serialization/)

### `.explode(explode)`

- `explode`: `boolean`

Parameters containing arrays and objects can be serialized in different ways. Explode specifies whether arrays and objects should generate separate parameters for each array item or object property. Read more at: [https://swagger.io/docs/specification/serialization/](https://swagger.io/docs/specification/serialization/)

### `.allowReserved(allowReserved)`

- `allowReserved`: `boolean`

[RFC 3986](https://tools.ietf.org/html/rfc3986#section-2.2) defines a set of reserved characters `:/?#[]@!$&'()*+,;=` that are used as URI component delimiters.
When these characters need to be used literally in a query parameter value, they are usually percent-encoded.
For example, `/` is encoded as `%2F` (or `%2f`), so that the parameter value `quotes/h2g2.txt` would be sent as:

```
GET /file?path=quotes%2Fh2g2.txt
```

If you want a query parameter that is not percent-encoded, set allowReserved to `true`.

### `.schema(schema)`

- `schema`: Joi.Schema ([link](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b8183c0147e7412a4e0414a5456441789473b4d8/types/hapi__joi/index.d.ts#L304))

To describe the parameter contents, you can use either the [`schema()`](#schemaschema) or [`addContent()`](addcontentcontenttype-schema) method.
They are mutually exclusive and used in different scenarios. In most cases, you would use `schema()`.
It lets you describe primitive values, as well as simple arrays and objects serialized into a string.
The serialization method for array and object parameters is defined by the `style()` and `explode() methods used in that parameter.

Bagger uses joi schemas and translates them into OpenAPI 3 schemas.

### `.examples(examples)`

- `examples`: `{ [key: string]: Joi.Schema }` ([link](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b8183c0147e7412a4e0414a5456441789473b4d8/types/hapi__joi/index.d.ts#L304))

You can add examples to parameters to make OpenAPI specification of your web service clearer.
Examples can be read by tools and libraries that process your API in some way.
For example, an API mocking tool can use sample values to generate mock requests.

The `examples` input object is an object where every key-value pair represents a named example.

### `.addContent(contentType, schema)`

- `contentType`: `string`
- `schema`: Joi.Schema ([link](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b8183c0147e7412a4e0414a5456441789473b4d8/types/hapi__joi/index.d.ts#L304))

To describe the parameter contents, you can use either the `schema()` or `addContent()` method.
They are mutually exclusive and used in different scenarios. In most cases, you would use `schema()`.
`addContent()` is used in complex serialization scenarios that are not covered by `style()` and `explode()`.
For example, if you need to send a JSON string in the query string like so:

```
filter={"type":"t-shirt","color":"blue"}
```

In this case you need to define the schema by using `addContent()` like this:

```js
const joi = require('@hapi/joi');
parameter.addContent(
  'application/json',
  joi.object().keys({
    type: joi.string(),
    color: joi.string()
  })
);
```

`mediaType` is the media type of the body. Like 'application/json'.

`schema` describes the format of the parameter. Bagger uses joi schemas and translates them into OpenAPI 3 schemas.

### `.getSchemas()`

Returns the schema if there exists a schema.

The return has the following format:

```
{ 'application/json': schema }
```

## `bagger.getRequestSchema()`
