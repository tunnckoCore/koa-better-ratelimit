koa-better-limit
================

Better, smaller, fastter. KoaJS middleware for limit request by ip, store in-memory.

## Install

```
npm install koa-better-limit
```

## Options
Initialize ratelimit middleware with the given `options`:
- **duration** limit duration in seconds, defaults to 3600 secdons (1 hour)
- **max** max requests per `ip`, defaults to 500
- **whiteList** array of all ips that won't be limited
- **blackList** array of all ips that always be limited and 403
- **message_429** message for all requests after limit
- **message_403** message for limited/forbidden 403


## Usage
```js
var app = require('koa')()
  , limit = require('koa-better-limit');

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