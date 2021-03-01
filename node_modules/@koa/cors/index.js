'use strict';

const vary = require('vary');

/**
 * CORS middleware
 *
 * @param {Object} [options]
 *  - {String|Function(ctx)} origin `Access-Control-Allow-Origin`, default is request Origin header
 *  - {String|Array} allowMethods `Access-Control-Allow-Methods`, default is 'GET,HEAD,PUT,POST,DELETE,PATCH'
 *  - {String|Array} exposeHeaders `Access-Control-Expose-Headers`
 *  - {String|Array} allowHeaders `Access-Control-Allow-Headers`
 *  - {String|Number} maxAge `Access-Control-Max-Age` in seconds
 *  - {Boolean} credentials `Access-Control-Allow-Credentials`
 *  - {Boolean} keepHeadersOnError Add set headers to `err.header` if an error is thrown
 * @return {Function} cors middleware
 * @api public
 */
module.exports = function(options) {
  const defaults = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  options = {
    ...defaults,
    ...options,
  };

  if (Array.isArray(options.exposeHeaders)) {
    options.exposeHeaders = options.exposeHeaders.join(',');
  }

  if (Array.isArray(options.allowMethods)) {
    options.allowMethods = options.allowMethods.join(',');
  }

  if (Array.isArray(options.allowHeaders)) {
    options.allowHeaders = options.allowHeaders.join(',');
  }

  if (options.maxAge) {
    options.maxAge = String(options.maxAge);
  }

  options.keepHeadersOnError = options.keepHeadersOnError === undefined || !!options.keepHeadersOnError;

  return async function cors(ctx, next) {
    // If the Origin header is not present terminate this set of steps.
    // The request is outside the scope of this specification.
    const requestOrigin = ctx.get('Origin');

    // Always set Vary header
    // https://github.com/rs/cors/issues/10
    ctx.vary('Origin');

    if (!requestOrigin) return await next();

    let origin;
    if (typeof options.origin === 'function') {
      origin = options.origin(ctx);
      if (origin instanceof Promise) origin = await origin;
      if (!origin) return await next();
    } else {
      origin = options.origin || requestOrigin;
    }

    let credentials;
    if (typeof options.credentials === 'function') {
      credentials = options.credentials(ctx);
      if (credentials instanceof Promise) credentials = await credentials;
    } else {
      credentials = !!options.credentials;
    }

    const headersSet = {};

    function set(key, value) {
      ctx.set(key, value);
      headersSet[key] = value;
    }

    if (ctx.method !== 'OPTIONS') {
      // Simple Cross-Origin Request, Actual Request, and Redirects
      set('Access-Control-Allow-Origin', origin);

      if (credentials === true) {
        set('Access-Control-Allow-Credentials', 'true');
      }

      if (options.exposeHeaders) {
        set('Access-Control-Expose-Headers', options.exposeHeaders);
      }

      if (!options.keepHeadersOnError) {
        return await next();
      }
      try {
        return await next();
      } catch (err) {
        const errHeadersSet = err.headers || {};
        const varyWithOrigin = vary.append(errHeadersSet.vary || errHeadersSet.Vary || '', 'Origin');
        delete errHeadersSet.Vary;

        err.headers = {
          ...errHeadersSet,
          ...headersSet,
          ...{ vary: varyWithOrigin },
        };
        throw err;
      }
    } else {
      // Preflight Request

      // If there is no Access-Control-Request-Method header or if parsing failed,
      // do not set any additional headers and terminate this set of steps.
      // The request is outside the scope of this specification.
      if (!ctx.get('Access-Control-Request-Method')) {
        // this not preflight request, ignore it
        return await next();
      }

      ctx.set('Access-Control-Allow-Origin', origin);

      if (credentials === true) {
        ctx.set('Access-Control-Allow-Credentials', 'true');
      }

      if (options.maxAge) {
        ctx.set('Access-Control-Max-Age', options.maxAge);
      }

      if (options.allowMethods) {
        ctx.set('Access-Control-Allow-Methods', options.allowMethods);
      }

      let allowHeaders = options.allowHeaders;
      if (!allowHeaders) {
        allowHeaders = ctx.get('Access-Control-Request-Headers');
      }
      if (allowHeaders) {
        ctx.set('Access-Control-Allow-Headers', allowHeaders);
      }

      ctx.status = 204;
    }
  };
};
