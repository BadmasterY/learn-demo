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

// 前端有 proxy, 需要 nsp 处理
io.of('/socket').on('connection', socket => {
  let clientIp = socket.request.connection.remoteAddress;;
  console.log('连接成功！可以使用 socket.io 了...')
  console.log('New connection from ' + clientIp);
  socket.on('call', data => {
    console.log(data);
  });
});