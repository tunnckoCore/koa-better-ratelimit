# better-ratelimit [![NPM version][npmjs-shields]][npmjs-url] [![Build Status][travis-img]][travis-url] [![Dependency Status][depstat-img]][depstat-url] [![Coveralls][coveralls-shields]][coveralls-url]
> Better, smaller, faster - [koa][koa-url] middleware for limit request by ip, store in-memory.


## Install [![Nodei.co stats][npmjs-install]][npmjs-url]
> Install with [npm](https://npmjs.org)

```
$ npm install koa-better-ratelimit
$ npm test
```

**This package follows [ferver](https://github.com/jonathanong/ferver)**
> Please read [history.md](history.md) for more info!

- option `message_429` deprecated **>=v2.1.x**, instead use `accessLimited`
- option `message_403` deprecated **>=v2.1.x**, instead use `accessForbidden`


## Usage
> Some demo example which is exactly `example.js`

```js
var app   = require('koa')(),
    limit = require('./index');

app.use(limit({
  duration: 1000 * 60 * 3, //3 mins
  max: 5
  //blackList: ['127.0.0.1']
}));

app.use(function * helloWorld(next) {
  this.body = 'Hello World';
  yield next;
});

var port = process.env.PORT || 3333;
app.listen(3333);
console.log('Koa server start listening on port ' + port);
```


## [.koaBetterRatelimit](index.js#L34)
> With options through init you can control black/white lists, limit per ip and reset interval.

* `[options]` **{Object}**
  - `duration` **{Integer}** Limit duration in milliseconds, default `1000 * 60 * 60 * 1` (1 hour)
  - `whiteList` **{Array}** All ips that won't be limited, default `empty array`
  - `blackList` **{Array}** All ips that always be limited and 403, default `empty array`
  - `accessLimited` **{String}** Message for all requests after limit, default `429: Too Many Requests.`
  - `accessForbidden` **{String}** Message for limited/forbidden, default `403: This is forbidden area for you.`
  - `max` **{Integer}** Max requests per ip, default `500`
  - `env` **{Boolean}** Manage enviroment, for tests will use `x-koaip` header, default `null`
* `return` **{GeneratorFunction}**


## Diferences
> Between [koa-better-ratelimit](https://github.com/tunnckoCore/koa-better-ratelimit) and [koa-ratelimit](https://github.com/koajs/ratelimit)

- Support blackList and whiteList options
- Pure in-memory store, no other adapters
- `duration` option in seconds, not in milliseconds
- 7 working tests
- removed `db` option
- added `Retry-After` header
- added separate 403 and 429 option messages

> Between [koa-better-ratelimit](https://github.com/tunnckoCore/koa-better-ratelimit) and [koa-limit](https://github.com/koajs/koa-limit)

- koa-limit [is totally broken](https://github.com/koajs/koa-limit/issues/3#issuecomment-42731409) (to v1.0.1)
- removed `redis` and test dependencies
- smaller, better, working, simple
- added separate 403 and 429 option messages


## Authors & Contributors 
**Charlike Make Reagent** [![author tips][author-gittip-img]][author-gittip]
+ [gittip/tunnckoCore][author-gittip]
+ [github/tunnckoCore][author-github]
+ [twitter/tunnckoCore][author-twitter]
+ [npmjs/tunnckoCore][author-npmjs]


## License [![MIT license][license-img]][license-url]
Copyright (c) 2014 [Charlike Make Reagent][author-website], [contributors](https://github.com/tunnckoCore/koa-better-ratelimit/graphs/contributors).  
Released under the [`MIT`][license-url] license.

[npmjs-url]: http://npm.im/koa-better-ratelimit
[npmjs-shields]: http://img.shields.io/npm/v/koa-better-ratelimit.svg
[npmjs-install]: https://nodei.co/npm/koa-better-ratelimit.svg?mini=true

[coveralls-url]: https://coveralls.io/r/tunnckoCore/koa-better-ratelimit?branch=master
[coveralls-shields]: https://img.shields.io/coveralls/tunnckoCore/koa-better-ratelimit.svg

[license-url]: https://github.com/tunnckoCore/koa-better-ratelimit/blob/master/license.md
[license-img]: http://img.shields.io/badge/license-MIT-blue.svg

[travis-url]: https://travis-ci.org/tunnckoCore/koa-better-ratelimit
[travis-img]: https://travis-ci.org/tunnckoCore/koa-better-ratelimit.svg?branch=master

[depstat-url]: https://david-dm.org/tunnckoCore/koa-better-ratelimit
[depstat-img]: https://david-dm.org/tunnckoCore/koa-better-ratelimit.svg

[author-gittip-img]: http://img.shields.io/gittip/tunnckoCore.svg
[author-gittip]: https://www.gittip.com/tunnckoCore
[author-github]: https://github.com/tunnckoCore
[author-twitter]: https://twitter.com/tunnckoCore

[author-website]: http://www.whistle-bg.tk
[author-npmjs]: https://npmjs.org/~tunnckocore

[koa-url]: https://github.com/koajs/koa