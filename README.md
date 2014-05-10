koa-better-ratelimit
================

Better, smaller, tested, working. KoaJS middleware for limit request by ip, store in-memory.

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
- 7 working tests
- removed `db` option
- added `Retry-After` header
- added separate 403 and 429 option messages

#### Between [koa-better-ratelimit](https://github.com/tunnckoCore/koa-better-ratelimit) and [koa-limit](https://github.com/koajs/koa-limit)
- koa-limit [is totally broken](https://github.com/koajs/koa-limit/issues/3#issuecomment-42731409) (to v1.0.1)
- removed `redis` and test dependencies
- smaller, better, working, simple
- added separate 403 and 429 option messages


## Test & Example
First run `npm install` before running tests to install devDependencies: mocha, supertest, should, koa.
```
npm install
npm test
```
or view examaple
```
npm install
npm start
```


## MIT LICENSE
The MIT License (MIT)

Copyright (c) 2014 [Charlike Mike Reagent](https://github.com/tunnckoCore) ([@tunnckoCore](https://twitter.com/tunnckoCore))

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
