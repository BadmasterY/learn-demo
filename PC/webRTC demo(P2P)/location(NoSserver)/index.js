/**
 * 整体流程
 * 接收端生成媒体流 -> 生成 peer 实例 -> 接收端创建 offer -> 
 * 呼叫端接收 offer -> 接收端创建本地 offer 描述 -> 呼叫端设置远程 offer 描述 ->
 * 呼叫端创建 answer -> 呼叫端设置本地 answer 描述 -> 接收端设置远程 answer 描述
 */

let localstream, peerA, peerB;

const peerConfig = {
  iceServers: [
    { url: 'stun:stun1.l.google.com:19302' },
  ],
};

async function createMedia() {
  // 流保存至全局
  localstream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
  let video = document.querySelector('#rtcA');
  if ('srcObject' in video) { // 判断是否支持 srcObject 属性
    video.srcObject = localstream;
  } else {
    video.src = window.URL.createObjectURL(localstream);
  }

  // 获取流媒体之后，初始化 RTCPeerConnection
  initPeer();
}

function initPeer() {
  let PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  // 分别创建实例
  peerA = new PeerConnection();
  peerB = new PeerConnection();

  peerA.oniceconnectionstatechange = (evt) => {
    console.log('A ICE state change: ' + evt.target.iceConnectionState);
  };

  peerB.oniceconnectionstatechange = (evt) => {
    console.log('B ICE state change: ' + evt.target.iceConnectionState);
  };

  // 添加本地流
  peerA.addStream(localstream);
  // 触发 icecandidate 事件时触发
  peerA.onicecandidate = event => {
    // 监听 A 的 ICE候选 信息
    // 如果收集到，就添加给 B
    console.log(peerA);
    console.log('A', event.candidate)
    if (event.candidate) {
      peerB.addIceCandidate(event.candidate);
    }
  }

  // 监听是否有流传入
  peerB.onaddstream = event => {
    let video = document.querySelector('#rtcB');
    if ('srcObject' in video) { // 判断是否支持 srcObject 属性
      video.srcObject = event.stream;
    } else {
      video.src = window.URL.createObjectURL(event.stream);
    }
  }

  peerB.onicecandidate = event => {
    // 监听 b 的 ICE候选 信息
    // 如果收集到，就添加给 A
    console.log('B', event.candidate)
    if (event.candidate) {
      peerA.addIceCandidate(event.candidate);
    }
  }
}

// 创建连接
async function call() {
  // 判断是是否有对应实例，没有就重新创建
  // 为了挂断之后重新创建准备
  if (!peerA || !peerB) {
    initPeer();
  }

  try {
    let offer = await peerA.createOffer(); // 接收端创建 offer
    await onCreateOffer(offer);
  } catch (e) {
    console.error('createOffer', e);
  }
}

async function onCreateOffer(desc) {
  console.log(desc);
  try {
    await peerA.setLocalDescription(desc); // 接收端设置本地 offer 描述
  } catch (e) {
    console.error('peerB-Offer-setLocalDescription: ', e);
  }

  try {
    await peerB.setRemoteDescription(desc); // 呼叫端设置远程 offer 描述
  } catch (e) {
    console.error('peerA-Offer-setRemoteDescription: ', e);
  }

  try {
    let answer = await peerB.createAnswer(); // 呼叫端创建 answer
    await onCreateAnswer(answer);
  } catch (e) {
    console.error('createAnswer: ', e);
  }
}

async function onCreateAnswer(desc) {
  try {
    await peerB.setLocalDescription(desc); // 接收端创建本地 answer 描述
  } catch (e) {
    console.error('peerA-Answer-setLocalDescription: ', e);
  }

  try {
    await peerA.setRemoteDescription(desc); // 呼叫端创建远程 answer 描述
  } catch (e) {
    console.error('peerB-Answer-setRemoteDescription: ', e);
  }
}

async function close() {
  console.log(`close webRTC`);
  // 关闭连接
  peerA.close();
  peerB.close();
  
  // 清理过期 peer
  peerA = null;
  peerB = null;

  // 呼叫端清理媒体流
  let video = document.querySelector('#rtcB');
  if ('srcObject' in video) { // 判断是否支持 srcObject 属性
    video.srcObject = null;
  } else {
    video.src = null;
  }
}

createMedia();

let callBtn = document.querySelector('#callBtn');
let closeBtn = document.querySelector('#closeBtn');
callBtn.addEventListener('click', e => {
  call();
});

closeBtn.addEventListener('click', e => {
  close();
});
