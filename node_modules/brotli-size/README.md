brotli-size

> Get the brotli compressed size of a string or buffer.

## Install

```
$ npm install --save brotli-size
```

## Usage

```js
var brotliSize = require('brotli-size');
var str = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam feugiat, mauris non aliquam pretium, libero nulla ultrices lacus, nec varius est purus sit amet dolor.';

console.log(str.length); // 165

console.log(brotliSize.sync(str)); // 118
```

## API

### brotliSize.sync(input)

#### input

Type: `string`, `buffer`

### brotliSize.stream()

Returns a passthrough stream. The stream emits a `brotli-size` event and
has a `brotliSize` property.
## Related

- [gzip-size](https://github.com/sindresorhus/gzip-size) - Heavily inspired by
this module. Thank you for the inspiration!
