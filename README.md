# 🎒 Bagger

[![npm (scoped)](https://img.shields.io/npm/v/@digitalroute/bagger?style=flat-square)](https://www.npmjs.com/package/@digitalroute/bagger)
[![npm](https://img.shields.io/npm/dm/@digitalroute/bagger?style=flat-square)](https://www.npmjs.com/package/@digitalroute/bagger)
[![CircleCI](https://img.shields.io/circleci/build/github/digitalroute/bagger/master?style=flat-square)](https://circleci.com/gh/digitalroute/workflows/bagger)
[![license](https://img.shields.io/github/license/digitalroute/bagger.svg?style=flat-square)](https://github.com/digitalroute/bagger/blob/master/LICENSE)

A joi-compatible tool for building swagger (Open API 3) definitions. It enables developers to use the same joi schemas for validation and documentation, ensuring that API documentation never becomes stale.

## Features

- 🔨 **Builder pattern:** Dead simple api to create complex Swagger definitions.
- ✨ **joi compatibility:** Enables developers to use the same schemas for validation and documentation.
- 🔎 **Intellisense:** Really nice intellisense suggestions, and TypeScript definitions.

## Example

```js
const bagger = require('bagger');
const joi = require('@hapi/joi');

bagger.configure({
  title: 'Bagger API',
  version: 'v1',
  description: 'Provides resources for building swagger definitions'
});

bagger
  .addRequest()
  .method('get')
  .path('/bags')
  .tag('bags')
  .tag('build')
  .responses([
    bagger
      .response(200)
      .description('Successfully fetched all bags')
      .content(
        'application/json',
        joi
          .array()
          .items(joi.string())
          .example(['handbag', 'backpack'])
      )
  ]);

const swaggerDefinition = bagger.compile();
```

## Documentation

- [Introduction](/docs/01-introduction.md)
  - [Getting started](/docs/01-introduction.md#getting-started)
  - [Working with multiple files](/docs/01-introduction.md#working-with-multiple-files)
- [Adding requests](/docs/02-requests.md) 🚧 Under construction 🚧
- [Creating resources](/docs/03-resources.md) 🚧 Under construction 🚧
  - Response
  - Content
  - Request body
- [Validating with joi](/docs/04-validation.md) 🚧 Under construction 🚧
  - Adding parameters
  - TODO: Adding body validation?
  - Getting validation schemas
- [Components](/docs/05-components.md) 🚧 Under construction 🚧
  - Declaring components
  - Referancing components
- [API Reference](/docs/06-api_reference.md) 🚧 Under construction 🚧
  - `bagger.configure()`
  - `bagger.compile()`
  - `bagger.addRequest(path, method)`
  - `bagger.addComponent()`
  - `bagger.response(httpCode)`
  - `bagger.requestBody()`
  - `bagger.parameter()`
  - `bagger.getRequestSchema()`
