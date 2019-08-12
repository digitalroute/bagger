# Bagger

[![npm (scoped)](https://img.shields.io/npm/v/@digitalroute/bagger?style=flat-square)](https://www.npmjs.com/package/@digitalroute/bagger)
[![npm](https://img.shields.io/npm/dm/@digitalroute/bagger)](https://www.npmjs.com/package/@digitalroute/bagger)
[![license](https://img.shields.io/github/license/digitalroute/bagger.svg?style=flat-square)](https://github.com/digitalroute/bagger/blob/master/LICENSE)

A joi-compatible tool for building swagger definitions. It enables developers use the same joi schemas for validation and documentation, ensuring that API documentation never becomes stale.

## Features

- 🔨 **Builder pattern:** Dead simple api to create complex Swagger definitions.
- ✨ **joi compatibility:** Enables developers to use the same schemas for validation and documentation.
- 🔎 **Intellisense:** Really nice intellisense suggestions, and TypeScript definitions.

## Table of Contents

WIP

## Example

```js
const bagger = require('bagger');
const joi = require('@hapi/joi');

const getHats = bagger
  .request()
  .method('get')
  .path('/hats')
  .tag('hats')
  .tag('build')
  .responses([
    bagger
      .response(200)
      .description('Successfully fetched all hats')
      .content(
        'application/json',
        joi
          .array()
          .items(joi.string())
          .example(['yellow hat', 'orange hat'])
      )
  ]);

const swaggerConfig = {
  title: 'Bagger API',
  version: 'v1',
  description: 'Provides resources for building swagger definitions'
};

const swaggerDefinition = bagger.compile(swaggerConfig, [getHats]);
```

## Installation

Install bagger using `npm`:

`npm install bagger`
