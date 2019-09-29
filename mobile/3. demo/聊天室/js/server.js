const WebSocket = require('ws');

let uid = 1; // 初始 uid

const wss = new WebSocket.Server({
  port: 3000,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed.
  }
}, () => console.log('Server listening at http://localhost:3000.'));

wss.on('connection', ws => {
  ws.uid = uid; // 保存分配的 uid

  // 发送登录信息
  ws.send(JSON.stringify({
    uid: uid,
    type: 'assign'
  }));
  
  // 广播
  wss.broadcast({
    uid: uid,
    type: 'welcome'
  });

  uid++;

  // 当收到消息时触发
  ws.on('message', message => {
    let data = JSON.parse(message);
    // 广播收到的消息
    wss.broadcast({
      uid: data.uid,
      message: data.message,
      type: 'message'
    });
  });

  // 连接断开时提示其他用户
  ws.on('close',() => {
    wss.broadcast({
      uid: ws.uid,
      type: 'leave'
    });
  });

});

// 广播给客户端
wss.broadcast = data => {
  // 遍历并发送消息
  wss.clients.forEach(function each(client) {
    client.send(JSON.stringify(data));
  });
}