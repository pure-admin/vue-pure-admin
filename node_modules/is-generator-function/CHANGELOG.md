1.0.7 / 2017-12-27
=================
  * [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `core-js`, `nsp`, `semver`, `tape`
  * [Tests] up to `node` `v9.3`, `v8.9`, `v6.12`; pin included builds to LTS; use `nvm install-latest-npm`
  * [Tests] run tests with uglify-register

1.0.6 / 2016-12-20
=================
  * [Fix] fix `is-generator-function` in an env without native generators, with core-js (https://github.com/ljharb/is-equal/issues/33)

1.0.5 / 2016-12-19
=================
  * [Fix] account for Safari 10 which reports the wrong toString on generator functions
  * [Refactor] remove useless `Object#toString` check
  * [Dev Deps] update everything; add linting
  * [Tests] use pretest/posttest for linting/security
  * [Tests] on all minors of node and io.js

1.0.4 / 2015-03-03
=================
  * Add support for concise generator methods (#2) This is a patch change since concise methods are not in any actual released engines yet.
  * Test on latest `io.js`
  * Update `semver`

1.0.3 / 2015-01-31
=================
  * Speed up travis-ci tests
  * Run tests against a faked @@toStringTag
  * Bail out early when typeof is not "function"

1.0.2 / 2015-01-20
=================
  * Update `jscs`, `tape`
  * Fix tests in newer v8 (and io.js) where Object#toString.call of a generator is GeneratorFunction, not Function

1.0.1 / 2014-12-14
=================
  * Update `jscs`, `tape`
  * Tweaks to README
  * Use `make-generator-function` in tests

1.0.0 / 2014-08-09
=================
  * Initial release.
