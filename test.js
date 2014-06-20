/**
 * koa-better-ratelimit - test.js
 * Copyright(c) 2014
 * MIT Licensed
 *
 * @author  Charlike Mike Reagent (@tunnckoCore)
 * @api private
 */
var koa = require('koa');
var limit = require('./index');
var assert = require('assert');
var request = require('supertest');
var http = require('http');


function *hello() {
  this.set('content-type', 'text/html')
  this.body = '<p>Hello test.</p>';
}

/**
 * [appNonDefault description]
 * @type {[type]}
 */
var appNonDefault = koa();
appNonDefault.use(limit({
  duration: 1000 * 60, //1 min
  max: 3, //max requests
  env: 'test'
}));
appNonDefault.use(hello);
appNonDefault = http.createServer(appNonDefault.callback());


/**
 * [appBlack description]
 * @type {[type]}
 */
var appBlack = koa();
appBlack.use(limit({
  blackList: ['4.4.1.*'],
  message_403: 'access forbidden, please contact foo@bar.com',
  env: 'test'
}));
appBlack.use(hello);
appBlack = http.createServer(appBlack.callback());


/**
 * [appWhite description]
 * @type {[type]}
 */
var appWhite = koa();
appWhite.use(limit({
  whiteList: ['127.0.*.*'],
  max: 50,
  env: 'test'
}));
appWhite.use(hello);
appWhite = http.createServer(appWhite.callback());

describe('appNonDefault', function () {
  it('should status 200 - 1.2.3.4 - remaining 2/3', function (done) {
    request(appNonDefault)
    .get('/')
    .set('x-koaip', '1.2.3.4')
    .expect(200)
    .expect('X-RateLimit-Limit', '3')
    .expect('X-RateLimit-Remaining', '2')
    .end(function(err, res) {
      res.text.should.equal('<p>Hello test.</p>');
      done();
    });
  });
  it('should status 200 - 1.2.3.4 - remaining 1/3', function (done) {
    request(appNonDefault)
    .get('/')
    .set('x-koaip', '1.2.3.4')
    .expect(200)
    .expect('X-RateLimit-Limit', '3')
    .expect('X-RateLimit-Remaining', '1')
    .end(function(err, res) {
      res.text.should.equal('<p>Hello test.</p>');
      done();
    });
  });
  it('should status 200 - 1.2.3.4 - remaining 0/3', function (done) {
    request(appNonDefault)
    .get('/')
    .set('x-koaip', '1.2.3.4')
    .expect(200)
    .expect('X-RateLimit-Limit', '3')
    .expect('X-RateLimit-Remaining', '0')
    .end(function(err, res) {
      res.text.should.equal('<p>Hello test.</p>');
      done();
    });
  });
  it('should status 429 - 1.2.3.4 - remaining 0/3 /1', function (done) {
    request(appNonDefault)
    .get('/')
    .set('x-koaip', '1.2.3.4')
    .expect(429)
    .expect('X-RateLimit-Limit', '3')
    .expect('X-RateLimit-Remaining', '0')
    .end(function(err, res) {
      res.text.should.equal('429: Too Many Requests.');
      done();
    });
  });
  it('should status 200 - 8.8.8.8 - remaining 2/3', function (done) {
    request(appNonDefault)
    .get('/')
    .set('x-koaip', '8.8.8.8')
    .expect(200)
    .expect('X-RateLimit-Limit', '3')
    .expect('X-RateLimit-Remaining', '2')
    .end(function(err, res) {
      res.text.should.equal('<p>Hello test.</p>');
      done();
    });
  });
  it('should status 200 - 8.8.8.8 - remaining 1/3', function (done) {
    request(appNonDefault)
    .get('/')
    .set('x-koaip', '8.8.8.8')
    .expect(200)
    .expect('X-RateLimit-Limit', '3')
    .expect('X-RateLimit-Remaining', '1')
    .end(function(err, res) {
      res.text.should.equal('<p>Hello test.</p>');
      done();
    });
  });
  it('should status 429 - 1.2.3.4 - remaining 0/3 /2', function (done) {
    request(appNonDefault)
    .get('/')
    .set('x-koaip', '1.2.3.4')
    .expect(429)
    .expect('X-RateLimit-Limit', '3')
    .expect('X-RateLimit-Remaining', '0')
    .end(function(err, res) {
      res.text.should.equal('429: Too Many Requests.');
      done();
    });
  });
  it('should status 200 - 8.8.8.8 - remaining 0/3', function (done) {
    request(appNonDefault)
    .get('/')
    .set('x-koaip', '8.8.8.8')
    .expect(200)
    .expect('X-RateLimit-Limit', '3')
    .expect('X-RateLimit-Remaining', '0')
    .end(function(err, res) {
      res.text.should.equal('<p>Hello test.</p>');
      done();
    });
  });
  it('should status 429 - 8.8.8.8 - remaining 0/3', function (done) {
    request(appNonDefault)
    .get('/')
    .set('x-koaip', '8.8.8.8')
    .expect(429)
    .expect('X-RateLimit-Limit', '3')
    .expect('X-RateLimit-Remaining', '0')
    .end(function(err, res) {
      res.text.should.equal('429: Too Many Requests.');
      done();
    });
  });
});

describe('appBlackList', function () {
  it('should 403 Forbidden - blackList', function (done) {
    request(appBlack)
    .get('/')
    .set('x-koaip', '4.4.1.8')
    .expect(403)
    .end(function(err, res) {
      res.text.should.equal('access forbidden, please contact foo@bar.com');
      done();
    });
  });
});

describe('appWhiteList', function () {
  it('should 200 OK - whiteList - no limits', function (done) {
    request(appWhite)
    .get('/')
    .set('x-koaip', '127.0.4.4')
    .expect(200)
    .end(function(err, res) {
      res.text.should.equal('<p>Hello test.</p>');
      done();
    });
  });
});
