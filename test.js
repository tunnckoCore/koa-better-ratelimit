var koa = require('koa');
var limit = require('./index');
var assert = require('assert');
var request = require('supertest');
var http = require('http');


function *hello() {
  this.body = 'Hello Test!';
}

/**
 * [appNonDefault description]
 * @type {[type]}
 */
var appNonDefault = koa();
appNonDefault.use(limit({
  duration: 1 * 60, //1 min
  max: 3 //max requests
}));
appNonDefault.use(hello);
appNonDefault = http.createServer(appNonDefault.callback());


/**
 * [appBlack description]
 * @type {[type]}
 */
var appBlack = koa();
appBlack.use(limit({
  blackList: ['127.0.0.*'],
  message_403: 'access forbidden, please contact foo@bar.com'
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
  max: 50
}));
appWhite.use(hello);
appWhite = http.createServer(appWhite.callback());




describe('appNonDefault', function () {
  it('should request 200 OK - first request', function (done) {
    request(appNonDefault)
    .get('/')
    .expect('Hello Test!')
    .expect(200, done);
  });
  it('should 200 OK - X-RateLimit-Remaining 1 of 3', function (done) {
    request(appNonDefault)
    .get('/')
    .expect('Hello Test!')
    .expect(200, done);
  });
  it('should request 200 OK - third request', function (done) {
    request(appNonDefault)
    .get('/')
    .expect('Hello Test!')
    .expect(200, done);
  });
  it('should request 429 Too Many Requests', function (done) {
    request(appNonDefault)
    .get('/')
    .expect('429: Too Many Requests. Retry in 1 minute')
    .expect(429, done);
  });
  it('should request 429 - X-RateLimit-Remaining 0 of 3', function (done) {
    request(appNonDefault)
    .get('/')
    .expect('X-RateLimit-Limit', '3')
    .expect('X-RateLimit-Remaining', '0')
    .expect(429, done);
  });
  setTimeout(function () {
    it('should 200 OK - after duration restart rates', function (done) {
      request(appNonDefault)
      .get('/')
      .expect(200, done);
    });
  }, (60*1000*1)+500);
});

describe('appBlackList', function () {
  it('should request 403 forbidden - blackList', function (done) {
    request(appBlack)
    .get('/')
    .expect('access forbidden, please contact foo@bar.com')
    .expect(403, done);
  });
});

describe('appWhiteList', function () {
  it('should request 200 OK - whiteList - no limits', function (done) {
    request(appWhite)
    .get('/')
    .expect(200, done);
  });
});