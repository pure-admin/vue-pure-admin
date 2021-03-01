
3.0.0 / 2016-02-27
==================

 * koa v2 support

2.1.0 / 2015-10-27
==================

 * test: add more node versions on travis ci
 * feat: support etag options

2.0.0 / 2014-08-30
==================

 * use etag module
 * use mz
 * remove options
 * etag signatures have changed

1.3.1 / 2014-07-22
==================

 * change `options.calculate=` to `options.hash=`

1.3.0 / 2014-06-17
==================

 * add `options.calculate=` for custom etag calculations

1.2.5 / 2014-06-17
==================

 * fix: make sure the file is there before we `stat` it

1.2.4 / 2014-05-04
==================

 * named generator function for improved debugging. Closes #7

1.2.3 / 2014-02-27
==================

 * don't set etag if already set

1.2.2 / 2013-12-27
==================

 * fix crc logic bug

1.2.1 / 2013-12-21
==================

 * add travis.yml
 * update to use use new middleware signature

1.1.0 / 2013-09-14
==================

 * add Stream with .path ETag support
