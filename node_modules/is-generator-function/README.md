# is-generator-function <sup>[![Version Badge][2]][1]</sup>

[![Build Status][3]][4]
[![dependency status][5]][6]
[![dev dependency status][7]][8]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][11]][1]

[![browser support][9]][10]

Is this a native generator function?

## Example

```js
var isGeneratorFunction = require('is-generator-function');
assert(!isGeneratorFunction(function () {}));
assert(!isGeneratorFunction(null));
assert(isGeneratorFunction(function* () { yield 42; return Infinity; }));
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[1]: https://npmjs.org/package/is-generator-function
[2]: http://versionbadg.es/ljharb/is-generator-function.svg
[3]: https://travis-ci.org/ljharb/is-generator-function.svg
[4]: https://travis-ci.org/ljharb/is-generator-function
[5]: https://david-dm.org/ljharb/is-generator-function.svg
[6]: https://david-dm.org/ljharb/is-generator-function
[7]: https://david-dm.org/ljharb/is-generator-function/dev-status.svg
[8]: https://david-dm.org/ljharb/is-generator-function#info=devDependencies
[9]: https://ci.testling.com/ljharb/is-generator-function.png
[10]: https://ci.testling.com/ljharb/is-generator-function
[11]: https://nodei.co/npm/is-generator-function.png?downloads=true&stars=true
[license-image]: http://img.shields.io/npm/l/is-generator-function.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/is-generator-function.svg
[downloads-url]: http://npm-stat.com/charts.html?package=is-generator-function

