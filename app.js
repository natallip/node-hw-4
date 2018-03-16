const Koa = require('koa');
const path = require('path');
const Pug = require('koa-pug');
const favicon = require('koa-favicon');
const serve = require('koa-static');
const session = require('koa-session');
const morgan = require('koa-morgan');
const app = new Koa();
const pug = new Pug({
  viewPath: path.join(process.cwd(), 'views'),
  basedir: path.join(process.cwd(), 'public'),
  app: app // Equivalent to app.use(pug)
});
// pug.use(app); // add koa-pug
app.keys = ['nodejs']; // set the session keys
const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  // overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true /** (boolean) httpOnly or not (default true) */
  // signed: true, /** (boolean) signed or not (default true) */
  // rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  // renew: false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

// app.use(session(CONFIG, app));
// or if you prefer all default config, just use => app.use(session(app));

app
  .use(favicon())
  .use(serve(path.join(process.cwd(), 'public')))
  .use(session(CONFIG, app)) // add koa-session
  .use(morgan('dev'))
  .use(require('./routes/index').routes());
// app.use(async (ctx, next) => {
//   try {
//     await next();
//   } catch (err) {
//     // will only respond with JSON
//     ctx.status = err.statusCode || err.status || 500;
//     ctx.body = {
//       message: err.message
//     };
//   }
// });
const server = app.listen(process.env.PORT || 8080, () => {
  console.log('Server running on port %d', server.address().port);
});
