# koa-etag

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

Etag support for Koa responses using [etag](https://github.com/jshttp/etag).

## Installation

```bash
# npm
$ npm install koa-etag
# yarn
$ yarn add koa-etag
```

## Example

```js
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const Koa = require('koa');
const app = new Koa();

// etag works together with conditional-get
app.use(conditional());
app.use(etag());

app.use(function (ctx) {
  ctx.body = 'Hello World';
});

app.listen(3000);

console.log('listening on port 3000');
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/koa-etag.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-etag
[github-tag]: http://img.shields.io/github/tag/koajs/etag.svg?style=flat-square
[github-url]: https://github.com/koajs/etag/tags
[travis-image]: https://img.shields.io/travis/koajs/etag.svg?style=flat-square
[travis-url]: https://travis-ci.org/koajs/etag
[coveralls-image]: https://img.shields.io/coveralls/koajs/etag.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/koajs/etag?branch=master
[david-image]: http://img.shields.io/david/koajs/etag.svg?style=flat-square
[david-url]: https://david-dm.org/koajs/etag
[license-image]: http://img.shields.io/npm/l/koa-etag.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/koa-etag.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/koa-etag
[gittip-image]: https://img.shields.io/gittip/jonathanong.svg?style=flat-square
[gittip-url]: https://www.gittip.com/jonathanong/
