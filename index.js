/*!
 * koa-better-ratelimit
 * Copyright(c) 2014 Charlike Mike Reagent (@tunnckoCore) <mameto_100@mail.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var ipchecker = require('ipchecker')
  , debug     = require('debug')('koa-better-ratelimit')
  , copy      = require('copy-to');

var defaultOptions = {
  duration: 3600,
  max: 500,
  whiteList: [],
  blackList: [],
  message_429: '429: Too Many Requests.',
  message_403: '403: This is forbidden area for you.',
};

/**
 * Expose `betterlimit()`.
 */

module.exports = betterlimit;

/**
 * Initialize koa-better-ratelimit middleware with the given `options`:
 * 
 * - `duration` limit duration in seconds, defaults to `3600` seconds (1 hour)
 * - `max` max requests per `ip`, defaults to `500`
 * - `whiteList` array of all ips that won't be limited
 * - `blackList` array of all ips that always be limited and 403
 * - `message_429` message for all requests after limit
 * - `message_403` message for limited/forbidden 403
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */

function betterlimit(options) {
  options = options || {};

  var db = {}, that;

  copy(defaultOptions).to(options);

  var whiteListMap = ipchecker.map(options.whiteList);
  var blackListMap = ipchecker.map(options.blackList);
  

  return function *ratelimit(next) {
    var ip = this.request.header['x-koaip'] || this.ip;
    
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

    if (isEmpty(db) || !db.hasOwnProperty(ip)) {
      that = db[ip] = {ip: ip, start: now, reset: now+options.duration, limit: options.max}
      debug('adds %s to database', ip);
    } else {
      debug('get %s from database', ip);
      that = db[ip];
    }

    if (that.limit + options.max !== options.max && now < that.reset) {
      that.limit = that.limit-1;
      this.set('X-RateLimit-Remaining', that.limit);
      this.set('X-RateLimit-Reset', that.reset);

      debug('ip %s have access', ip);
      return yield *next;
    } else {
      this.status = 429;
      this.body = options.message_429;
      this.set('Retry-After', that.reset-now);
      this.set('X-RateLimit-Remaining', 0);
      this.set('X-RateLimit-Reset', that.reset);
      debug('ip %s don`t have access, until %s', ip, that.reset);
    }
  }
}

function isEmpty(value){
  return Boolean(value && typeof value == 'object') && !Object.keys(value).length;
}
