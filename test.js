/*!
 * koa-better-ratelimit <https://github.com/tunnckoCore/koa-better-ratelimit>
 *
 * Copyright (c) 2014-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

const ratelimit = require('./index')
const Koa = require('koa2')
const app = new Koa()

app
  .use(function * (next) {
    try {
      yield * next
    } catch (e) {
      console.log('err', e)
    }
  })
  .use(ratelimit({
    // it can be double star - globstar
    // or *.*.*.*
    id: function () {
      return '0.0.0.0'
    },
    duration: 1000 * 20,
    // filter: '*.*.*.*',
    max: 2,
    throw: true
  }))

// .listen(2222, function () {
//   console.log('Foo bar baz!')
// })
