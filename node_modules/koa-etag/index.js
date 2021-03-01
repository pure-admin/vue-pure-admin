
'use strict'

/**
 * Module dependencies.
 */

const calculate = require('etag')
const Stream = require('stream')
const promisify = require('util').promisify
const fs = require('fs')

const stat = promisify(fs.stat)

/**
 * Expose `etag`.
 *
 * Add ETag header field.
 * @param {object} [options] see https://github.com/jshttp/etag#options
 * @param {boolean} [options.weak]
 * @return {Function}
 * @api public
 */

module.exports = function etag (options) {
  return async function etag (ctx, next) {
    await next()
    const entity = await getResponseEntity(ctx)
    setEtag(ctx, entity, options)
  }
}

async function getResponseEntity (ctx) {
  // no body
  const body = ctx.body
  if (!body || ctx.response.get('etag')) return

  // type
  const status = ctx.status / 100 | 0

  // 2xx
  if (status !== 2) return

  if (body instanceof Stream) {
    if (!body.path) return
    return await stat(body.path)
  } else if ((typeof body === 'string') || Buffer.isBuffer(body)) {
    return body
  } else {
    return JSON.stringify(body)
  }
}

function setEtag (ctx, entity, options) {
  if (!entity) return

  ctx.response.etag = calculate(entity, options)
}
