/*!
 * koa-better-ratelimit <https://github.com/tunnckoCore/koa-better-ratelimit>
 *
 * Copyright (c) 2014-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

const convert = require('koa-convert')
const compose = require('koa-compose')
const filter = require('koa-ip-filter')
const extend = require('extend-shallow')

module.exports = function koaBetterRatelimit (opts) {
  opts.filter = opts.filter || '**'

  const ipFilter = convert(filter(opts))
  let store = opts.store && typeof opts.store === 'object'
    ? opts.store
    : {}

  return compose([ipFilter, function betterRatelimit (ctx, next) {
    const headers = extend({
      remaining: 'X-RateLimit-Remaining',
      reset: 'X-RateLimit-Reset',
      limit: 'X-RateLimit-Limit'
    }, opts.headers)
    const options = extend({
      duration: 1000 * 60 * 60 * 24,
      limited: 'Too Many Requests',
      max: 500
    }, options)

    const id = ctx.identifier
    const data = store[id]
    const now = Date.now()
    const reset = now + options.duration
    const needReset = data && data.remaining === false && data.reset < now

    if (!store.hasOwnProperty(id) || needReset) {
      store[id] = {
        id: id,
        reset: reset,
        remaining: options.max
      }
    }

    const entry = store[id]
    entry.remaining = entry.remaining > 0
        ? entry.remaining - 1
        : false

    ctx.set(headers.remaining, entry.remaining || 0)
    ctx.set(headers.reset, entry.reset)
    ctx.set(headers.limit, options.max)

    if (typeof entry.remaining === 'number') {
      return next()
    }

    const after = entry.reset - (now / 1000) | 0
    ctx.set('Retry-After', after)

    ctx.status = 429
    ctx.body = typeof options.limited === 'function'
        ? options.limited(ctx, entry)
        : options.limited

    if (options.throw) {
      ctx.throw(ctx.status, ctx.body)
    }
  }])
}
