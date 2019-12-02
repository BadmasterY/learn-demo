import socket from '../io/io'; // socket.io
import store from '../store/index'; // vuex
import { createMedia } from './media'; // 媒体操作

/**
 * 初始化 peer
 */
async function initPeer() {
  let stream = await createMedia();
  
  let PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  // 创建实例
  let peer = new PeerConnection();
  
  // 添加媒体流
  // addStream 一个旧的 api 可以换成 addTrack
  for(const track of stream.getTracks()) {
    console.log(track);
    console.log(stream);
    peer.addTrack(track, stream);
  }

  peer.ontrack = event => {
    console.log(event);
  }

  // 监听 ice候选 信息
  peer.onicecandidate = event => {
    if (event.candidate) {
      // 发送到远端
      socket.emit('ice', { id: store.state.user.id, sdp: event.candidate });
    }
  }

  return peer;
}

// 创建 offer
async function createOffer(peer) {
  let offer = await peer.createOffer(); // 创建 offer
  await peer.setLocalDescription(offer); // 设置本地 offer 信息(谁创建的谁放本地)

  return offer;
}

// 接收到 answer
async function onAnswer(data) {
  let peer = store.state.peer;
  await peer.setRemoteDescription(data.answer); // 设置远端 answer 信息
}

// 接收到 ICE
async function onICE(data) {
  let peer = store.state.peer;
  await peer.addIceCandidate(data.sdp); // 添加 ice
}

export {
  initPeer,
  createOffer,
  onAnswer,
  onICE,
}