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

app.listen(3333);
console.log('listening on port 3333');