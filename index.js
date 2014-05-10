/*!
 * koa-better-limit
 * Copyright(c) 2014 @tunnckoCore <mameto_100@mail.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var ipchecker = require('ipchecker')
  , debug     = require('debug')('koa-better-limit')
  , copy      = require('copy-to')
  , ms        = require('ms');

var defaultOptions = {
  duration: 3600,
  max: 500,
  whiteList: [],
  blackList: [],
  message_429: '429: Too Many Requests',
  message_403: '403: This is forbidden area for you',
};

/**
 * Expose `ratelimit()`.
 */

module.exports = ratelimit;

/**
 * Initialize ratelimit middleware with the given `opts`:
 * 
 * - `duration` limit duration in seconds, defaults 3600 secdons (1 hour)
 * - `max` max requests per `ip`, defaults to 500
 * - `whiteList` array of all ips that won't be limited
 * - `blackList` array of all ips that always be limited and 403
 * - `message_429` message for all requests after limit
 * - `message_403` message for limited/forbidden 403
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */

function ratelimit(options) {
  options = options || {};

  var db = [];

  copy(defaultOptions).to(options);

  var whiteListMap = ipchecker.map(options.whiteList);
  var blackListMap = ipchecker.map(options.blackList);

  return function *(next) {
    var ip = this.ip;

    if (!ip) {
      debug('can not get ip for the request');
      return yield *next;
    }

    var now = Math.round(+new Date()/1000);

    // check black list
    if (ipchecker.check(ip, blackListMap)) {
      debug('request ip: %s is in the blackList', ip);
      this.status = 403;
      this.body = options.message_403;
      return;
    }

    // check white list
    if (ipchecker.check(ip, whiteListMap)) {
      debug('request ip: %s is in the whiteList', ip);
      return yield *next;
    }


    this.set('X-RateLimit-Limit', options.max);

    // check exists in db
    if (db.length <= 0) {
      db.push({ip: ip, start: now, reset: now+options.duration, limit: options.max});
      db[0].limit--;
      this.set('X-RateLimit-Remaining', db[0].limit);
      this.set('X-RateLimit-Reset', db[0].reset);

      debug('request ip %s not exists in in-memory db... added', ip);
      yield next;
    } else {
      if (db[0].ip == ip) {
        debug('request ip: %s exists in in-memory db', ip);

        if (now > db[0].reset) {
          db[0].limit = limit-1;
          db[0].start = now;
          db[0].reset = now+options.duration;
          this.set('X-RateLimit-Remaining', db[0].limit);
          this.set('X-RateLimit-Reset', db[0].reset);

          debug('reset rate limit after duration %s', options.duration);
          debug('and X-RateLimit-Reset now is %s', db[0].reset);
          yield next;
        } else {
          if (db[0].limit <= 0) {
            var retryAfter = db[0].reset-now;
            var rertryIn = ms(retryAfter*1000, {long: true});
            this.set('X-RateLimit-Remaining', 0);
            this.set('X-RateLimit-Reset', db[0].reset);
            this.set('Retry-After', retryAfter);
            this.status = 429;
            this.body = options.message_429 + '. Retry in ' + ms(retryAfter*1000, {long: true});

            debug('request of %s is limited. retry in %s', ip, rertryIn);
          } else {
            db[0].limit--;
            this.set('X-RateLimit-Remaining', db[0].limit);
            this.set('X-RateLimit-Reset', db[0].reset);

            debug('request: %s, remaining %s requests', ip, db[0].limit);
            yield next;
          }
        }
      }
    }
  }
}