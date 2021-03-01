
'use strict'

/**
 * Expose `conditional`.
 *
 * Conditional GET support middleware.
 *
 * @return {Function}
 * @api public
 */

module.exports = function conditional () {
  return async function (ctx, next) {
    await next()

    if (ctx.fresh) {
      ctx.status = 304
      ctx.body = null
    }
  }
}
