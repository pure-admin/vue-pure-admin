# Koa Proxies

![NPM](https://img.shields.io/npm/v/koa-proxies.svg)
[![TavisCI Build](https://img.shields.io/travis/vagusX/koa-proxies.svg)](https://travis-ci.org/vagusX/koa-proxies)
[![CircieCI Build](https://img.shields.io/circleci/project/github/vagusX/koa-proxies.svg)](https://circleci.com/gh/vagusX/koa-proxies)
[![Coverage](https://img.shields.io/codecov/c/github/vagusX/koa-proxies.svg)](https://codecov.io/gh/vagusX/koa-proxies)
[![NPM Downloads](https://img.shields.io/npm/dm/koa-proxies.svg)](https://www.npmjs.com/package/koa-proxies)
[![Greenkeeper badge](https://badges.greenkeeper.io/vagusX/koa-proxies.svg)](https://greenkeeper.io/)

> [Koa@2.x/next](https://github.com/koajs/koa) middlware for http proxy

Powered by [`http-proxy`](https://github.com/nodejitsu/node-http-proxy).

## Installation

```bash
$ npm install koa-proxies --save
```

## Options

### http-proxy events

```js
options.events = {
  error (err, req, res) { },
  proxyReq (proxyReq, req, res) { },
  proxyRes (proxyRes, req, res) { }
}
```

### log option
```js
// enable log
options.logs = true; // or false

// custom log function
options.logs = (ctx, opts.target) {
  console.log('%s - %s %s proxy to -> %s', new Date().toISOString(), ctx.req.method, ctx.req.oldPath, new URL(ctx.req.url, target))
} 
```

## Usage

```js
// dependencies
const Koa = require('koa')
const proxy = require('koa-proxies')
const httpsProxyAgent = require('https-proxy-agent')

const app = new Koa()

// middleware
app.use(proxy('/octocat', {
  target: 'https://api.github.com/users',    
  changeOrigin: true,
  agent: new httpsProxyAgent('http://1.2.3.4:88'), // if you need or just delete this line
  rewrite: path => path.replace(/^\/octocat(\/|\/\w+)?$/, '/vagusx'),
  logs: true
}))
```

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
