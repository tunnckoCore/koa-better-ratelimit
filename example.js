/**
 * koa-better-ratelimit <https://github.com/tunnckoCore/koa-better-ratelimit>
 *
 * Copyright (c) 2014 Charlike Mike Reagent, contributors.
 * Released under the MIT license.
 */

'use strict';

var app   = require('koa')();
var limit = require('./index');

app.use(limit({
  duration: 30000, //30 seconds
  max: 5,
  //blackList: ['127.0.0.1']
}));

app.use(function * (next) {
  this.body = 'Hello World';
  yield next;
});

var port = process.env.PORT || 3333;
app.listen(port);
console.log('Koa server start listening on port ' + port);
