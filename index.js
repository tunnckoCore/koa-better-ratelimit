/**
 * koa-better-ratelimit <https://github.com/tunnckoCore/koa-better-ratelimit>
 *
 * Copyright (c) 2014 Charlike Mike Reagent, contributors.
 * Released under the MIT license.
 */

'use strict';

var extend = require('extend-shallow');
var filter = require('arr-filter');

var defaults = {
  duration: 1000 * 60 * 60 * 24,
  whiteList: [],
  blackList: [],
  accessLimited: '429: Too Many Requests.',
  accessForbidden: '403: This is forbidden area for you.',
  max: 500,
  id: null
};

/**
 * With options through init you can control
 * black/white lists, limit per ip and reset interval.
 *
 * @param {Object} `opts`
 * @api public
 */
module.exports = function betterlimit(opts) {
  opts = extend({}, defaults, opts);

  var db = {};

  return function * ratelimit(next) {
    var id = opts.id ? opts.id(this) : this.ip;

    if (!id) {
      return yield * next;
    }
    
    var blackFilter = filter(opts.blackList, function _blackFilter(item) {
      return item === id;
    });
    if (blackFilter.length > 0) {
      this.response.status = 403;
      this.response.body = opts.accessForbidden;
      return;
    }

    var whiteFilter = filter(opts.whiteList, function _whiteFilter(item) {
      return item === id;
    });

    if (whiteFilter.length > 0) {
      return yield * next;
    }

    var now = Date.now()
    var reset = now + opts.duration;

    if (!db.hasOwnProperty(id)) {
      db[id] = {ip: id, reset: reset, limit: opts.max}
    }

    var delta = db[id].reset - now
    var retryAfter = delta / 1000 | 0;

    db[id].limit = db[id].limit - 1
    this.response.set('X-RateLimit-Limit', opts.max);

    if (db[id].reset > now) {
      var rateLimiting = db[id].limit < 0 ? 0 : db[id].limit;
      this.response.set('X-RateLimit-Remaining', rateLimiting);
    }

    if (db[id].limit < 0 && db[id].reset < now) {
      db[id] = {ip: id, reset: reset, limit: opts.max}
      db[id].limit = db[id].limit - 1;
      this.response.set('X-RateLimit-Remaining', db[id].limit);
    }

    this.response.set('X-RateLimit-Reset', db[id].reset);

    if (db[id].limit < 0) {
      this.response.set('Retry-After', retryAfter);
      this.response.status = 429;
      this.response.body = opts.accessLimited
      return;
    }

    return yield * next
  };
}
