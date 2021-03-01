
5.0.0 / 2018-06-19
==================

 * bump deps
 * fix bug that set Content-Type not working. (#105)

4.1.2 / 2017-12-14
==================

 * Fix issue with dots in path when using extensions array (#92)

4.1.1 / 2017-09-25
==================

 * Fix brotli support, closes #83
 * Fix tests

4.1.0 / 2017-04-26
==================

 * Add support for Cache-Control: immutable with a new "immutable" option
 * Added serving of brotli versions of files

4.0.0 / 2017-04-09
==================

 * throw error if file not exists, closes #43
 * remove co, use async function
 * bump deps

3.3.0 / 2017-01-10
==================

 * add extensions option
 * bump deps

3.2.0 / 2016-03-23
==================

 * add setHeaders option

3.1.1 / 2016-03-04
==================

 * bump deps
 * simplify scripts

3.1.0 / 2015-10-24
==================

 * return a promise instead of a generator
 * fix: split path by path.sep instead of slash
 * fix: strip root correctly on windows
 * tests: resolve paths for windows

3.0.1 / 2015-10-23
==================

 * fix stats info when path does not finish with slash and format is enabled, closes #34

3.0.0 / 2015-10-21
==================

 * bump deps
 * format option defaults to true
 * fix: enable format only index exists
 * simplify the declarations of `format`, `gzip`

2.0.1 / 2015-10-14
==================

 * fix judgement of trailing slash

2.0.0 / 2015-10-14
==================

 * serve directories without a trailing slash, closes #27
 * when .hidden option is set, also check hidden directories, closes #17
 * bump deps: mz@2, mocha@2, koa@1
 * use resolve-path, closes #9
 * gzip version of file should not be automatically sent
 * fix test: gzip.json.gz is not valid json data

1.3.1 / 2014-09-08
==================

 * add .maxAge alias

1.3.0 / 2014-09-07
==================

 * add automatically check and serve `.gz` files
 * remove `finished` dependency
 * refactor with `mz`

1.2.3 / 2014-02-11
==================

 * fix malicious path in windows
 * update finished
 * make assert message better

1.2.2 / 2014-01-07
==================

 * fix: ignore directories instead of crashing koa

1.2.1 / 2014-01-02
==================

 * add `content-length` header

1.2.0 / 2013-12-27
==================

 * add `maxage` option

1.1.2 / 2013-12-22
==================

 * replace deprecated ctx.error() with ctx.throw()

1.1.1 / 2013-12-20
==================

 * use: on-socket-error

1.1.0 / 2013-12-19
==================

 * add: `send` now returns the file path if sent
 * add: destroy streams on socket errors to prevent fd leaks
