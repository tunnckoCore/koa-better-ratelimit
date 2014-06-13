koa-better-ratelimit
================

[![Build Status](https://travis-ci.org/tunnckoCore/koa-better-ratelimit.png)](https://travis-ci.org/tunnckoCore/koa-better-ratelimit) [![Dependencies Status](https://david-dm.org/tunnckoCore/koa-better-ratelimit/status.svg)](https://david-dm.org/tunnckoCore/koa-better-ratelimit)
[![Koa-based package](http://img.shields.io/badge/koa-0.6.1-brightgreen.svg)](https://github.com/koajs/koa)

Better, smaller, faster, tested. KoaJS middleware for limit request by ip, store in-memory.

## Install

```
npm install koa-better-ratelimit
```

## Options
Initialize koa-better-ratelimit middleware with the given `options`:
- **duration** limit duration in seconds, defaults to `3600` seconds (1 hour)
- **max** max requests per `ip`, defaults to `500`
- **whiteList** array of all ips that won't be limited
- **blackList** array of all ips that always be limited and 403
- **message_429** message for all requests after limit
- **message_403** message for limited/forbidden 403
- **env** managing the enviroment, for tests will use `x-koaip` header


## Usage
```js
var app = require('koa')()
  , limit = require('./index');

app.use(limit({
  duration: 3 * 60, //3 mins
  max: 5,
  //blackList: ['127.0.0.1']
}));

app.use(function * (next) {
  this.body = 'Hello World';
  yield next;
});

var port = process.env.PORT || 3333;
app.listen(3333);
console.log('Koa server start listening on port ' + port);
```

## Diferences
#### Between [koa-better-ratelimit](https://github.com/tunnckoCore/koa-better-ratelimit) and [koa-ratelimit](https://github.com/koajs/ratelimit)
- Support blackList and whiteList options
- Pure in-memory store, no other adapters
- `duration` option in seconds, not in milliseconds
- 11 working tests
- removed `db` option
- added `Retry-After` header
- added separate 403 and 429 option messages

#### Between [koa-better-ratelimit](https://github.com/tunnckoCore/koa-better-ratelimit) and [koa-limit](https://github.com/koajs/koa-limit)
- koa-limit [is totally broken](https://github.com/koajs/koa-limit/issues/3#issuecomment-42731409) (to v1.0.1)
- removed `redis` and test dependencies
- smaller, better, working, simple
- added separate 403 and 429 option messages


## Test, Example
First run `npm install` before run anything.
```
npm install
npm test
DEBUG=koa-better-ratelimit npm test
```
or view examaple
```
npm install
npm start
```

## Credit

|[![Charlike Mike Reagent](https://avatars2.githubusercontent.com/u/5038030?s=120)](https://github.com/tunnckoCore)|
|---|
|[George Yanev](https://github.com/tunnckoCore) (creator, npm)|


## License
The MIT License (MIT) [@tunnckoCore](https://twitter.com/tunnckoCore)
