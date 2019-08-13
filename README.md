# Bagger

[![npm (scoped)](https://img.shields.io/npm/v/@digitalroute/bagger?style=flat-square)](https://www.npmjs.com/package/@digitalroute/bagger)
[![npm](https://img.shields.io/npm/dm/@digitalroute/bagger)](https://www.npmjs.com/package/@digitalroute/bagger)
[![CircleCI](https://img.shields.io/circleci/build/github/digitalroute/bagger/master?style=flat-square)](https://circleci.com/gh/digitalroute/workflows/bagger)
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

const getBags = bagger
  .request()
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

const swaggerConfig = {
  title: 'Bagger API',
  version: 'v1',
  description: 'Provides resources for building swagger definitions'
};

const swaggerDefinition = bagger.compile(swaggerConfig, [getBags]);
```

## Installation

Install bagger using `npm`:

`npm install bagger`
