const website = 'http://127.0.0.1:3001'; // 服务器地址

let rooms = []; // 房间列表
let online = []; // 在线成员列表

let roomID = null; // 房间id
let userName = uuidv4(); // 用户名
let otherUserId = null; // 呼叫的用户id
let stream = null; // 媒体流
let peer = null; // RTCPeerConnection 实例

let callBtn = document.querySelector('#callBtn');
let closeBtn = document.querySelector('#closeBtn');
let linkBtn = document.querySelector('#link');

let roomsBox = document.querySelector('#rooms');
let usersBox = document.querySelector('#users');
let roomidBox = document.querySelector('#roomid');
let userInfo = document.querySelector('#userInfo');

let video = document.querySelector('#rtc');

roomsBox.addEventListener('click', e => {
  if (e.target.className == 'room') {
    let dom = e.target;
    roomID = dom.innerText;
    roomidBox.innerText = dom.innerText;
    join();
  }
});

usersBox.addEventListener('click', e => {
  if (e.target.className == 'user') {
    let dom = e.target;
    userInfo.innerText = dom.innerText;
    otherUserId = dom.innerText;
  }
});

const socket = io.connect(website, {
  autoConnect: false, // 自动连接
  transports: ['websocket']
});

socket.on('connect', async () => {
  await socket.emit('online', { userName }); // 告诉服务器  谁上线了
  await socket.emit('getRoom');
  await socket.emit('getOnline');
});

socket.on('onlineChange', data => {
  online = data;
  usersBox.innerHTML = '';
  online.forEach(user => {
    const div = document.createElement('div');
    div.className = 'user';
    div.innerText = user;
    if (user === userName) return;
    usersBox.appendChild(div);
  });
});

// 获取房间信息
socket.on('getRoom', data => {
  rooms = data;
  rooms.forEach(room => {
    const div = document.createElement('div');
    div.className = 'room';
    div.innerText = room;
    roomsBox.appendChild(div);
  });
});
// 获取在线成员信息
socket.on('getOnline', data => {
  online = data;
  console.log(usersBox.innerHTML);
  usersBox.innerHTML = '';
  online.forEach(user => {
    const div = document.createElement('div');
    div.className = 'user';
    div.innerText = user;
    if (user === userName) return;
    usersBox.appendChild(div);
  });
});

// 来电
socket.on('apply', data => {
  console.log(data);
  if (confirm('是否接听?')) {
    //接听,因为时来电  对方id放在 self 下
    reply(data.selfId, '1');
    // 收到消息，同意之后创建 peer
    createP2P(data);
  } else {
    reply(data.selfId, '2');
  }
});

// 结果
socket.on('reply', async data => {
  switch (data.type) {
    case '1': // 同意
      console.log('同意...');
      // 收到答复  创建 peer 与 offer
      await createP2P(data);
      await createOffer(data);
      break;
    case '2': // 拒绝
      console.log('拒绝...');
      break;
  }
});

// 接收到 offer
socket.on('offer', data => {
  onOffer(data);
});

// 接收到 answer
socket.on('answer', data => {
  onAnswer(data);
});

// 接收到 ICE
socket.on('ICE', data => {
  onICE(data);
});

// 结束通话
socket.on('close', data => {
  onClose();
});

// 有人加入房间
socket.on('joined', data => {
  console.log(data);
});

linkBtn.addEventListener('click', e => {
  socket.connect();
});

callBtn.addEventListener('click', async e => {
  call(otherUserId);
});

closeBtn.addEventListener('click', e => {
  close();
});

// 加入房间
function join() {
  if (!roomID) {
    console.error('请检查是否选择了房间');
    return;
  }
  console.log({ roomid: roomID, userName: userName });
  socket.emit('join', { roomid: roomID, userName: userName });
}

// 呼叫远端
function call(otherUserId) {
  if (!otherUserId) {
    console.error('请选择需要呼叫的成员!');
    return;
  }
  console.log('正在呼叫...');
  socket.emit('apply', { otherId: otherUserId, selfId: userName });
}

// 处理回复
function reply(otherUserId, type) {
  socket.emit('reply', { otherId: otherUserId, selfId: userName, type: type });
}

// 初始化
async function createP2P(data) {
  await createMedia(data);
}

// 获取流媒体
async function createMedia(data) {
  stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

  // 获取流媒体之后，初始化 RTCPeerConnection
  initPeer(data);
}

// 创建 peer
function initPeer(data) {
  let PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  // 分别创建实例
  peer = new PeerConnection();
  // 添加媒体流
  peer.addStream(stream);

  // 监听 ice候选 信息
  peer.onicecandidate = event => {
    if (event.candidate) {
      // 发送到远端
      socket.emit('ICE', { otherId: data.selfId, selfId: data.otherId, sdp: event.candidate });
    }
  }

  // 监听是否有媒体流接入
  peer.onaddstream = event => {
    if ('srcObject' in video) { // 判断是否支持 srcObject 属性
      video.srcObject = event.stream;
    } else {
      video.src = window.URL.createObjectURL(event.stream);
    }
  }
}

// 创建 offer
async function createOffer(data) {
  let offer = await peer.createOffer(); // 创建 offer
  await peer.setLocalDescription(offer); // 设置本地 offer 信息(谁创建的谁放本地)

  // 通过 socket 发送
  socket.emit('offer', { otherId: data.selfId, selfId: data.otherId, sdp: offer });
}

// 接收到 offer
async function onOffer(data) {
  await peer.setRemoteDescription(data.sdp); // 设置远端 offer 信息

  createAnswer(data);
}

// 创建 answer
async function createAnswer(data) {
  let answer = await peer.createAnswer(); // 创建 answer
  await peer.setLocalDescription(answer); // 设置本地 answer 信息

  // 通过 socket 发送
  socket.emit('answer', { otherId: data.selfId, selfId: data.otherId, sdp: answer });
}

// 接收到 answer
async function onAnswer(data) {
  peer.setRemoteDescription(data.sdp); // 设置远端 answer 信息
}

// 接收到 ICE
async function onICE(data) {
  peer.addIceCandidate(data.sdp); // 添加 ice
}

// 结束通话
function close() {
  onClose();

  socket.emit('close', {otherId: otherUserId, selfId: userName});
}

// 应答结束
function onClose() {
  peer.close();
  peer = null;
  if ('srcObject' in video) { // 判断是否支持 srcObject 属性
    video.srcObject = null;
  } else {
    video.src = null;
  }
}