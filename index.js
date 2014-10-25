/**
 * koa-better-ratelimit <https://github.com/tunnckoCore/koa-better-ratelimit>
 *
 * Copyright (c) 2014 Charlike Mike Reagent, contributors.
 * Released under the MIT license.
 */

'use strict';

/**
 * Module dependencies.
 */

var ipchecker = require('ipchecker');
var copy = require('copy-to');

var defaults = {
  duration: 1000 * 60 * 60 * 24,
  whiteList: [],
  blackList: [],
  message_429: '429: Too Many Requests.',
  message_403: '403: This is forbidden area for you.',
  max: 500,
  env: null
};

/**
 * With options through init you can control
 * black/white lists, limit per ip and reset interval.
 * 
 * @param {Object} options
 * @see https://github.com/tunnckoCore/koa-better-ratelimit#options
 * @api public
 */
module.exports = function betterlimit(options) {
  options = options || {};

  var db = {}, that;

  copy(defaults).to(options);

  var whiteListMap = ipchecker.map(options.whiteList);
  var blackListMap = ipchecker.map(options.blackList);
  

  return function *ratelimit(next) {
    var ip = options.env === 'test' ? this.request.header['x-koaip'] : this.ip;
    
    if (!ip) {
      //debug('can not get ip for the request');
      return yield *next;
    }

    var now = (Date.now() / 1000) | 0; //in sec
    var reset = now + ((options.duration / 1000) | 0)

    if (ipchecker.check(ip, blackListMap)) {
      //debug('request ip: %s is in the blackList', ip);
      this.status = 403;
      this.body = options.message_403;
      return;
    }

    if (ipchecker.check(ip, whiteListMap)) {
      //debug('request ip: %s is in the whiteList', ip);
      return yield *next;
    }

    this.set('X-RateLimit-Limit', options.max);

    if (isEmpty(db) || !db.hasOwnProperty(ip)) {
      that = db[ip] = {ip: ip, start: now, reset: reset, limit: options.max}
      //debug('adds %s to database', ip);
    } else {
      //debug('get %s from database', ip);
      that = db[ip];
    }

    if (that.limit + options.max !== options.max && now < that.reset) {
      that.limit = that.limit-1;
      this.set('X-RateLimit-Remaining', that.limit);
      this.set('X-RateLimit-Reset', that.reset);

      //debug('ip %s have access', ip);
      return yield *next;
    } else {
      this.status = 429;
      this.body = options.message_429;
      this.set('Retry-After', that.reset-now);
      this.set('X-RateLimit-Remaining', 0);
      this.set('X-RateLimit-Reset', that.reset);
      //debug('ip %s don`t have access, until %s', ip, that.reset);
    }
  }
}

function isEmpty(value){
  return Boolean(value && typeof value == 'object') && !Object.keys(value).length;
}
