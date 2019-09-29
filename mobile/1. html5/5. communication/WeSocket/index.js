if(!WebSocket) throw new Error('浏览器不支持...');

// 创建 websocket 连接
let socket = new WebSocket('ws://127.0.0.1:3000');

// 监听 open 事件,同时发送消息到服务器
socket.addEventListener('open', e => {
    socket.send('Hello World!');
});

// 监听 message 事件,当有新的消息从服务器传来时触发
socket.addEventListener('message', e => {
   document.body.innerText = e.data; 
});

// 监听 error 事件,发生错误时触发
socket.addEventListener('error', e => {
    throw new Error(e.data);
});

// 监听 close 事件,服务器连接关闭时触发
socket.addEventListener('close', e => {
    console.log('closed...');
});