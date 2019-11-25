const Koa = require('koa');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const routers = require('./router/router');
const app = new Koa();
const { utilMaps } = require('./util/maps');

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
  console.log('连接成功！可以使用 socket.io 了...');
  console.log('New connection from ' + clientIp);

  // 连接成功,将需要的信息放入 Map
  socket.on('online', data => {
    const { onlineMap, socketMap } = utilMaps;
    console.log(data);
    onlineMap.set(data.id, data);
    socketMap.set(data.id, socket);
  });

  // 将呼叫信息转发
  socket.on('call', data => {
    const { onlineMap, socketMap } = utilMaps;
    let calledUser = onlineMap.get(data.otherUser.id);
    if (calledUser) {
      socketMap.get(data.otherUser.id).emit('call', data);
    } else {
      socket.emit('err', { error: 1, msg: '未能找到该用户信息...' });
    }
  });

  // accept
  socket.on('accept', data => {
    const { sendMap, socketMap } = utilMaps;
    socketMap.get(data.otherUser.id).emit('reply', data);

    // 初始化 webRTC，创建 peer 信息并发送
    if(data.accept) {
      // 放入转发 map
      let tempArr_1 = sendMap.get(data.self.id) || [];
      let tempArr_2 = sendMap.get(data.otherUser.id) || [];
      sendMap.set(data.self.id, tempArr_1.concat(data.otherUser));
      sendMap.set(data.otherUser.id, tempArr_2.concat(data.self));

      
    }
  });
});