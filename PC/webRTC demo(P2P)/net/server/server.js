const Koa = require('koa');
const cors = require('koa2-cors');
const koaBody = require('koa-body');

const app = new Koa();

app.use(cors({ origin: true })); // 跨域
app.use(koaBody()); // 解析body

const server = require('http').Server(app.callback());
const io = require('socket.io')(server, { transports: ['websocket'] });
const port = 3001; // 启动端口

// 启动服务器
server.listen(process.env.PORT || port, () => {
  console.log(`server run at : http://127.0.0.1:${port}`);
});

const room = ['1001', '1002']; // 例子采用固定房间号
const online = new Map(); // 成员
const sockS = {}; // 不同客户端对应的 sock 实例
const users = {}; // 成员列表

io.on('connection', socket => {
  console.log('连接成功！可以使用 socket.io 进行通信...');
  socket.on('online', data => {
    if(online.has(data.userName)) return;
    online.set(data.userName, data.userName);
    let onlineArr = [];
    online.forEach(item => {
      onlineArr.push(item);
    });
    socket.emit('onlineChange', onlineArr);
    socket.broadcast.emit('onlineChange', onlineArr);
  })

  // 获取房间信息
  socket.on('getRoom', data => {
    socket.emit('getRoom', room);
  });

  // 获取在线成员
  socket.on('getOnline', data => {
    let onlineArr = [];
    online.forEach(item => {
      onlineArr.push(item);
    });
    socket.emit('getOnline', onlineArr);
  });

  socket.on('join', data => {
    // 以 roomid 创建房间
    socket.join(data.roomid, () => {
      if(!users[data.roomid]) {
        users[data.roomid] = []; // 如果列表中未存在该房间，创建
      }
      
      // 未使用 user id 这个属性，不过 username 通过 uuidV4生成 可以当作唯一标识
      let arr = users[data.roomid].filter(item => item.userId === data.userName); 

      // 如果在当前房间内未找到，新建
      if(!arr.length) {
        let obj = {userId: data.userName, socketId: socket.id}; // 创建一个实例
        users[data.roomid].push(obj);
      }

      sockS[data.userName] = socket; // 保存不同客户端对应的 socket 实例

      // 向房间内所有人广播
      io.to(data.roomid).emit('joined', users[data.roomid]);
    });
  });

  // 呼叫转发(就是个接线员)
  socket.on('apply', data => {
    console.log(`呼叫方: ${data.otherId}`);
    sockS[data.otherId].emit('apply', data);
  });

  // 转发结果
  socket.on('reply', data => {
    console.log(`应答方: ${data.otherId}`);
    sockS[data.otherId].emit('reply', data);
  });

  // ice 转发
  socket.on('ICE', data => {
    sockS[data.otherId].emit('ICE', data);
  });

  // offer 转发
  socket.on('offer', data => {
    sockS[data.otherId].emit('offer', data);
  });

  // answer 转发
  socket.on('answer', data => {
    sockS[data.otherId].emit('answer', data);
  });

  // close 转发
  socket.on('close', data => {
    console.log(`结束通话: 发起人${data.selfId}`);
    sockS[data.otherId].emit('close', data);
  });

  socket.on('disconnect', data => {
    console.log('连接断开...');
    socket.emit('onlineChange', online);
  })
});