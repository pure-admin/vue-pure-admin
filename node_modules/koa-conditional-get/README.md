
# koa-conditional-get 

[![Build Status](https://travis-ci.org/koajs/conditional-get.png)](https://travis-ci.org/koajs/conditional-get)

Conditional GET support for koa.


## Installation

```bash
# npm
$ npm install koa-conditional-get
# yarn
$ yarn add koa-conditional-get
```


## Example

```js
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const Koa = require('koa');
const app = new Koa();

// use it upstream from etag so
// that they are present
app.use(conditional());

// add etags
app.use(etag());

// respond
app.use(async function(ctx, next){
  await next();

  ctx.body = {
    name: 'tobi',
    species: 'ferret',
    age: 2
  };
})

app.listen(
  3000,
  console.log('listening on port 3000')
)
```

## License

[MIT](LICENSE)
