
5.0.0 / 2018-06-19
==================

 * bump deps

4.0.3 / 2018-05-17
==================

 * npm: disable package-lock
 * bump deps

4.0.2 / 2017-11-16
==================

* Fix: `serve` mutates `opts` argument so it cannot be reused (#117)

4.0.1 / 2017-07-09
==================

 * Fix: throw error if error status not 404
 * fix `index: false` bug if path is directory

4.0.0 / 2017-07-03
==================

 * upgrade to koa-send@4
 * use async function

3.0.0 / 2016-03-24
==================

 * support koa 2.x
 * travis: test node@4+

2.0.0 / 2016-01-07
==================

 * bump koa-send@~3.1.0

1.5.2 / 2015-11-03
==================

 * Fix: default index could be disabled. Closes #41

1.5.1 / 2015-10-14
==================

 * Fix v1.4.x → 1.5.0 broken. Closes #53

1.5.0 / 2015-10-14
==================

 * update koa-send@2
 * update devDeps

1.4.9 / 2015-02-03
==================

 * only support GET and HEAD requests

1.4.8 / 2014-12-17
==================

 * support root = `.`

1.4.7 / 2014-09-07
==================

 * update koa-send

1.4.5 / 2014-05-05
==================

 * Fix response already handled logic - Koajs now defaults status == 404. See  koajs/koa#269

1.4.4 / 2014-05-04
==================

 * Add two missing semicolons. Closes #24
 * Use bash syntax highlighting for install command. Closes #23
 * named generator function to help debugging. Closes #20

1.4.3 / 2014-02-11
==================

 * update koa-send

1.4.2 / 2014-01-07
==================

 * update koa-send

1.4.1 / 2013-12-30
==================

 * fix for koa 0.2.1. Closes #12

1.4.0 / 2013-12-20
==================

 * add: defer option - semi-breaking change

1.3.0 / 2013-12-11
==================

 * refactor to use koa-send
 * rename maxAge -> maxage
 * fix: don't bother responding if response already "handled"

1.2.0 / 2013-09-14
==================

 * add Last-Modified. Closes #5

1.1.1 / 2013-09-13
==================

 * fix upstream responses

1.1.0 / 2013-09-13
==================

 * rewrite without send
