const Koa = require('koa');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const routers = require('./router/router');
const app = new Koa();

app.use(cors({ origin: true })); // 跨域
app.use(koaBody()); // 解析body
app.use(routers.routers); // 路由

const server = require('http').Server(app.callback());
const io = require('socket.io')(server, { transports: ['websocket'] });
const port = 3000; // 启动端口

// 启动服务器
server.listen(process.env.PORT || port, () => {
  console.log(`server run at : http://127.0.0.1:${port}`);
});