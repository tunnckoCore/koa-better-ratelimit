/**
 * koa-better-ratelimit <https://github.com/tunnckoCore/koa-better-ratelimit>
 *
 * Copyright (c) 2014-2015 Charlike Mike Reagent, contributors.
 * Released under the MIT license.
 */

'use strict';

var koa = require('koa');
var http = require('http');
var limit = require('./index');
var assert = require('assert');
var request = require('supertest');

function helloMiddleware() {
  return function * hello(next) {
    this.response.type = 'text/html'
    this.response.body = '<p>Hello test.</p>';
    yield * next;
  }
}

/**
 * appNonDefault description
 */
var appNonDefault = koa();
appNonDefault.use(limit({
  duration: 1000 * 60, // 1 min
  max: 3, // max requests
  id: function(ctx) {
    return ctx.request.header['x-koaip'];
  }
}));
appNonDefault.use(helloMiddleware());
appNonDefault = http.createServer(appNonDefault.callback());

/**
 * appBlack description
 */
var appBlack = koa();
appBlack.use(limit({
  blackList: ['4.4.1.8'], // @todo: as of 2.2.x, no more wildecards...
  accessForbidden: 'access forbidden, please contact foo@bar.com',
  id: function(ctx) {
    return ctx.request.header['x-koaip'];
  }
}));
appBlack.use(helloMiddleware());
appBlack = http.createServer(appBlack.callback());

/**
 * appWhite description
 */
var appWhite = koa();
appWhite.use(limit({
  whiteList: ['127.0.4.4'], // @todo: too limited, not support wildcards
  max: 50,
  id: function(ctx) {
    return ctx.request.header['x-koaip'];
  }
}));
appWhite.use(helloMiddleware());
appWhite = http.createServer(appWhite.callback());

describe('appNonDefault', function() {
  it('should status 200 - 1.2.3.4 - remaining 2/3', function(done) {
    request(appNonDefault)
    .get('/')
    .set('x-koaip', '1.2.3.4')
    .expect(200, '<p>Hello test.</p>')
    .expect('X-RateLimit-Limit', '3')
    .expect('X-RateLimit-Remaining', '2')
    .end(function _end(err, res) {
      assert.ifError(err);
      assert.strictEqual(res.text, '<p>Hello test.</p>');
      assert.strictEqual(res.type, 'text/html');
      done();
    });
  });
  it('should status 200 - 1.2.3.4 - remaining 1/3', function(done) {
    request(appNonDefault)
    .get('/')
    .set('x-koaip', '1.2.3.4')
    .expect(200, '<p>Hello test.</p>')
    .expect('X-RateLimit-Limit', '3')
    .expect('X-RateLimit-Remaining', '1')
    .end(function _end(err, res) {
      assert.ifError(err);
      assert.strictEqual(res.text, '<p>Hello test.</p>');
      assert.strictEqual(res.type, 'text/html');
      done();
    });
  });
  it('should status 200 - 1.2.3.4 - remaining 0/3', function(done) {
    request(appNonDefault)
    .get('/')
    .set('x-koaip', '1.2.3.4')
    .expect(200, '<p>Hello test.</p>')
    .expect('X-RateLimit-Limit', '3')
    .expect('X-RateLimit-Remaining', '0')
    .end(function _end(err, res) {
      assert.ifError(err);
      assert.strictEqual(res.text, '<p>Hello test.</p>');
      assert.strictEqual(res.type, 'text/html');
      done();
    });
  });
  it('should status 429 - 1.2.3.4 - remaining 0/3 /1', function(done) {
    request(appNonDefault)
    .get('/')
    .set('x-koaip', '1.2.3.4')
    .expect(429, '429: Too Many Requests.')
    .expect('X-RateLimit-Limit', '3')
    .expect('X-RateLimit-Remaining', '0')
    .end(function _end(err, res) {
      assert.ifError(err);
      assert.strictEqual(res.type, 'text/plain');
      done();
    });
  });
  it('should status 200 - 8.8.8.8 - remaining 2/3', function(done) {
    request(appNonDefault)
    .get('/')
    .set('x-koaip', '8.8.8.8')
    .expect(200, '<p>Hello test.</p>')
    .expect('X-RateLimit-Limit', '3')
    .expect('X-RateLimit-Remaining', '2')
    .end(done);
  });
  it('should status 200 - 8.8.8.8 - remaining 1/3', function(done) {
    request(appNonDefault)
    .get('/')
    .set('x-koaip', '8.8.8.8')
    .expect(200, '<p>Hello test.</p>')
    .expect('X-RateLimit-Limit', '3')
    .expect('X-RateLimit-Remaining', '1')
    .end(done);
  });
  it('should status 429 - 1.2.3.4 - remaining 0/3 /2', function(done) {
    request(appNonDefault)
    .get('/')
    .set('x-koaip', '1.2.3.4')
    .expect(429, '429: Too Many Requests.')
    .expect('X-RateLimit-Limit', '3')
    .expect('X-RateLimit-Remaining', '0')
    .end(done);
  });
  it('should status 200 - 8.8.8.8 - remaining 0/3', function(done) {
    request(appNonDefault)
    .get('/')
    .set('x-koaip', '8.8.8.8')
    .expect(200, '<p>Hello test.</p>')
    .expect('X-RateLimit-Limit', '3')
    .expect('X-RateLimit-Remaining', '0')
    .end(done);
  });
  it('should status 429 - 8.8.8.8 - remaining 0/3', function(done) {
    request(appNonDefault)
    .get('/')
    .set('x-koaip', '8.8.8.8')
    .expect(429, '429: Too Many Requests.')
    .expect('X-RateLimit-Limit', '3')
    .expect('X-RateLimit-Remaining', '0')
    .end(done);
  });
});

describe('appBlackList', function() {
  it('should 403 Forbidden - blackList', function(done) {
    request(appBlack)
    .get('/')
    .set('x-koaip', '4.4.1.8')
    .expect(403, 'access forbidden, please contact foo@bar.com')
    .end(done);
  });
});

describe('appWhiteList', function() {
  it('should 200 OK - whiteList - no limits', function(done) {
    request(appWhite)
    .get('/')
    .set('x-koaip', '127.0.4.4')
    .expect(200, '<p>Hello test.</p>')
    .end(done);
  });
});
