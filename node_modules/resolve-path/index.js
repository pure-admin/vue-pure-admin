/*!
 * resolve-path
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2018 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

var createError = require('http-errors')
var join = require('path').join
var normalize = require('path').normalize
var pathIsAbsolute = require('path-is-absolute')
var resolve = require('path').resolve
var sep = require('path').sep

/**
 * Module exports.
 * @public
 */

module.exports = resolvePath

/**
 * Module variables.
 * @private
 */

var UP_PATH_REGEXP = /(?:^|[\\/])\.\.(?:[\\/]|$)/

/**
 * Resolve relative path against a root path
 *
 * @param {string} rootPath
 * @param {string} relativePath
 * @return {string}
 * @public
 */

function resolvePath (rootPath, relativePath) {
  var path = relativePath
  var root = rootPath

  // root is optional, similar to root.resolve
  if (arguments.length === 1) {
    path = rootPath
    root = process.cwd()
  }

  if (root == null) {
    throw new TypeError('argument rootPath is required')
  }

  if (typeof root !== 'string') {
    throw new TypeError('argument rootPath must be a string')
  }

  if (path == null) {
    throw new TypeError('argument relativePath is required')
  }

  if (typeof path !== 'string') {
    throw new TypeError('argument relativePath must be a string')
  }

  // containing NULL bytes is malicious
  if (path.indexOf('\0') !== -1) {
    throw createError(400, 'Malicious Path')
  }

  // path should never be absolute
  if (pathIsAbsolute.posix(path) || pathIsAbsolute.win32(path)) {
    throw createError(400, 'Malicious Path')
  }

  // path outside root
  if (UP_PATH_REGEXP.test(normalize('.' + sep + path))) {
    throw createError(403)
  }

  // join the relative path
  return normalize(join(resolve(root), path))
}
