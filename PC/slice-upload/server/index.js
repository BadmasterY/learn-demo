const Koa = require('koa');
const cors = require('koa2-cors');
const body = require('koa-better-body');
const routers = require('./router/index');

const app = new Koa();

app.use(cors({ origin: true }));
app.use(body());
app.use(routers.routers);