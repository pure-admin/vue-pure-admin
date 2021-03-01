1.4.0 / 2018-02-13
==================

  * Fix resolving paths with certain special characters
  * deps: http-errors@~1.6.2
    - Make `message` property enumerable for `HttpError`s
    - deps: depd@1.1.1
    - deps: setprototypeof@1.0.3

1.3.3 / 2016-11-14
==================

  * deps: path-is-absolute@1.0.1

1.3.2 / 2016-06-17
==================

  * deps: http-errors@~1.5.0
    - Use `setprototypeof` module to replace `__proto__` setting
    - deps: inherits@2.0.1
    - deps: statuses@'>= 1.3.0 < 2'
    - perf: enable strict mode

1.3.1 / 2016-02-28
==================

  * deps: http-errors@~1.4.0

1.3.0 / 2015-06-15
==================

  * Use `path-is-absolute` to better detect absolute paths
  * perf: enable strict mode
  * perf: skip a variable reassignment

1.2.2 / 2015-02-16
==================

  * deps: http-errors@~1.3.1
    - Construct errors using defined constructors from `createError`
    - Fix error names that are not identifiers
    - Set a meaningful `name` property on constructed errors

1.2.1 / 2015-01-19
==================

  * Fix root path disclosure

1.2.0 / 2015-01-05
==================

  * Change error to 403 Forbidden when outside root
  * Fix argument type errors to be consistent
  * Fix path traversal vulnerability
  * Use `http-errors` module directly

1.1.0 / 2014-12-27
==================

  * Resolve the root path argument
  * Use `http-assert` module

1.0.0 / 2014-03-23
==================

  * Initial release
