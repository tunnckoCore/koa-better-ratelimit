## [![npm][npmjs-img]][npmjs-url][![mit license][npmjs-license]][license-url][![using ferver versioning][ferver-img]][ferver-url][![build status][travis-img]][travis-url][![coverage status][coveralls-img]][coveralls-url][![deps status][daviddm-img]][daviddm-url]

> Better, smaller, faster - [koa][koa-url] middleware for limit request by ip, store in-memory.

### [upcoming v3](https://github.com/tunnckoCore/koa-better-ratelimit/milestones/v3)

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


## License [![MIT license][npmjs-license]][license-url]
Copyright (c) 2014-2015 [Charlike Mike Reagent][contrib-more], [contributors][contrib-graf].  
Released under the [`MIT`][license-url] license.


[npmjs-url]: http://npm.im/koa-better-ratelimit
[npmjs-img]: https://img.shields.io/npm/v/koa-better-ratelimit.svg?style=flat-square&label=koa-better-ratelimit

[npmjs-dw]: https://img.shields.io/npm/dm/koa-better-ratelimit.svg?style=flat-square
[npmjs-license]: https://img.shields.io/npm/l/koa-better-ratelimit.svg?style=flat-square

[coveralls-url]: https://coveralls.io/r/tunnckoCore/koa-better-ratelimit?branch=master
[coveralls-img]: https://img.shields.io/coveralls/tunnckoCore/koa-better-ratelimit.svg?style=flat-square

[license-url]: https://github.com/tunnckoCore/koa-better-ratelimit/blob/master/license.md
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square

[ferver-url]: https://github.com/jonathanong/ferver
[ferver-img]: https://img.shields.io/badge/using-ferver-blue.svg?style=flat-square

[travis-url]: https://travis-ci.org/tunnckoCore/koa-better-ratelimit
[travis-img]: https://img.shields.io/travis/tunnckoCore/koa-better-ratelimit.svg?style=flat-square

[daviddm-url]: https://david-dm.org/tunnckoCore/koa-better-ratelimit
[daviddm-img]: https://img.shields.io/david/tunnckoCore/koa-better-ratelimit.svg?style=flat-square

[author-gratipay]: https://gratipay.com/tunnckoCore
[author-twitter]: https://twitter.com/tunnckoCore
[author-github]: https://github.com/tunnckoCore
[author-npmjs]: https://npmjs.org/~tunnckocore

[contrib-more]: http://j.mp/1stW47C
[contrib-graf]: https://github.com/tunnckoCore/koa-better-ratelimit/graphs/contributors

[koa-url]: https://github.com/koajs/koa

***

_Powered and automated by [kdf](https://github.com/tunnckoCore), March 24, 2015_
