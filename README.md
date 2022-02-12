# 🎒 Bagger

[![npm (scoped)](https://img.shields.io/npm/v/@digitalroute/bagger?style=flat-square)](https://www.npmjs.com/package/@digitalroute/bagger)
[![npm](https://img.shields.io/npm/dm/@digitalroute/bagger?style=flat-square)](https://www.npmjs.com/package/@digitalroute/bagger)
[![Build](https://github.com/digitalroute/bagger/actions/workflows/PR-Tests.yml/badge.svg)](https://github.com/digitalroute/bagger/actions/workflows/PR-Tests.yml)
[![license](https://img.shields.io/github/license/digitalroute/bagger.svg?style=flat-square)](https://github.com/digitalroute/bagger/blob/master/LICENSE)

A joi-compatible tool for building Swagger (Open API 3) documents. It enables developers to use the same joi schemas for validation and documentation, ensuring that API documentation never becomes stale.

## Features

- 🔨 **Builder pattern:** Dead simple api to create complex Swagger documents.
- ✨ **joi compatibility:** Enables developers to use the same schemas for validation and documentation.
- 🔎 **Intellisense:** Really nice intellisense suggestions, and TypeScript definitions.
- 🔒 **Type safety:** Bagger always produces 100% valid Swagger documents. If you use TypeScript the compiler will enforce correctness in most cases, and otherwise Bagger will validate during compilation.

## Usage

```js
// Use the default Bagger instance
const bagger = require('@digitalroute/bagger').default;

// OR

// Create a new instance
const { Bagger } = require('@digitalroute/bagger');
const bagger = new Bagger();
```

## Example

```js
const { Bagger } = require('@digitalroute/bagger');
const joi = require('@hapi/joi');
const bagger = new Bagger();

bagger.configure({
  title: 'Bagger API',
  version: 'v1',
  description: 'Provides resources for building swagger documents'
});

bagger
  .addRequest('/bags', 'get')
  .addTag('bags')
  .addTag('build')
  .addResponse(
    bagger
      .response(200)
      .description('Successfully fetched all bags')
      .content(
        'application/json',
        joi
          .array()
          .items(joi.string())
          .example([['handbag', 'backpack', 'purse']])
      )
  );

const swaggerDefinition = bagger.compile();
```

## Documentation

- [Introduction](/docs/01-introduction.md)
  - [Getting started](/docs/01-introduction.md#getting-started)
  - [Working with multiple files](/docs/01-introduction.md#working-with-multiple-files)
- [API Reference](/docs/02-api_reference.md)
  - [`bagger.configure()`](/docs/02-api_reference.md#baggerconfigure)
  - [`bagger.compile()`](/docs/02-api_reference.md#baggercompile)
  - [`bagger.addRequest(path, method)`](/docs/02-api_reference.md#baggeraddrequestpath-method)
  - [`bagger.addComponent()`](/docs/02-api_reference.md#baggeraddcomponent)
  - [`bagger.response(httpCode)`](/docs/02-api_reference.md#baggerresponsehttpcode)
  - [`bagger.requestBody()`](/docs/02-api_reference.md#baggerrequestbody)
  - [`bagger.parameter().<type>(name)`](/docs/02-api_reference.md#baggerparametertypename)
  - [`bagger.getRequestSchema()`](/docs/02-api_reference.md#baggergetrequestschema)
