import socket from '../io/socket.io'; // socket.io
import store from '../vuex/store'; // vuex
import { createMedia } from './media'; // 媒体操作

/**
 * 初始化 peer
 * @param {Object} data 数据
 */
async function initPeer(data) {
  let stream = await createMedia();

  let PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  // 创建实例
  let peer = new PeerConnection({
    iceServers: [
      { url: 'stun:stun.voipstunt.com' },
      { url: 'stun:stun1.l.google.com:19302' },
      {
        urls: 'turn:39.105.208.159:3478',
        username: 'iris',
        credential: '123456',
      },
    ],
  });

  // 添加媒体流
  peer.addStream(stream);

  // 监听 ice候选 信息
  peer.onicecandidate = event => {
    if (event.candidate) {
      // 发送到远端
      socket.emit('ICE', { otherId: data.selfId, selfId: data.otherId, sdp: event.candidate });
    }
  }

  return peer;
}

// 创建 offer
async function createOffer(peer, data) {
  let offer = await peer.createOffer(); // 创建 offer
  await peer.setLocalDescription(offer); // 设置本地 offer 信息(谁创建的谁放本地)

  // 通过 socket 发送
  socket.emit('offer', { otherId: data.selfId, selfId: data.otherId, sdp: offer });
}

// 接收到 offer
async function onOffer(data) {
  let peer = store.state.peerList.get(`${data.otherId}-${data.selfId}`);
  await peer.setRemoteDescription(data.sdp); // 设置远端 offer 信息

  let answer = await peer.createAnswer(); // 创建 answer
  await peer.setLocalDescription(answer); // 设置本地 answer 信息

  // 通过 socket 发送
  socket.emit('answer', { otherId: data.selfId, selfId: data.otherId, sdp: answer });
}

// 接收到 answer
async function onAnswer(data) {
  let peer = store.state.peerList.get(`${data.otherId}-${data.selfId}`);
  await peer.setRemoteDescription(data.sdp); // 设置远端 answer 信息
}

// 接收到 ICE
async function onICE(data) {
  let peer = store.state.peerList.get(`${data.otherId}-${data.selfId}`);
  await peer.addIceCandidate(data.sdp); // 添加 ice
}

export {
  initPeer,
  createOffer,
  onOffer,
  onAnswer,
  onICE,
}