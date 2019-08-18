# API Reference

To use bagger `bagger.configure().info(info)` has to be called before `bagger.compile()`. Every added request has to have at least one defined response.

- `bagger.configure()`
  - `.info(info)`
  - `.addServer(server)`
  - `.addSecurity(security)`
  - `.externalDocs(externalDocs)`
- `bagger.compile()`
- `bagger.addRequest(path, method)`
  - `.addResponse(response)`
  - `.operationId(operationId)`
  - `.deprecated(deprecated)`
  - `.summary(summary)`
  - `.addTag(tag)`
  - `.addSecurity(scheme, scopes)`
  - `.body(requestBody)`
  - `.addParameter(parameter)`
- `bagger.addComponent()`
  - Schema WIP?
- `bagger.response(httpCode)`
  - `.description(description)`
  - `.content(mediaType, schema)`
- `bagger.requestBody()`
  - `.required(required)`
  - `.content(contentType, schema)`
  - `.getSchemas()`
- `bagger.parameter().<type>(name)`
  - `.getType()`
  - `.description(description)`
  - `.required(required)`
  - `.deprecated(deprecated)`
  - `.allowEmptyValue(allowEmptyValue)`
  - `.style(style)`
  - `.explode(explode)`
  - `.allowReserved(allowReserved)`
  - `.schema(schema)`
  - `.examples(examples)`
  - `.addContent(contentType, schema)`
  - `.getSchemas()`
- `bagger.getRequestSchema()`

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

### `.addSecurity(security)`

### `.externalDocs(externalDocs)`

## `bagger.compile()`

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
