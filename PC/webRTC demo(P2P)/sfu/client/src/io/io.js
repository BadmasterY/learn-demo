import io from 'socket.io-client'
import store from '../store/index'
import { initPeer, createOffer, onAnswer, onICE } from '../util/webrtc';

const socket = io.connect('/socket', {
  autoConnect: false, // 自动连接
  transports: ['websocket']
});

// 连接成功
socket.on('connect', function () {
  console.log(`连接成功! socket 功能已启用...`);
  console.log(store.state.user);
  socket.emit('online', store.state.user);
});

socket.on('online', data => {
  console.log(data);
});

socket.on('call', data => {
  console.log(data);
  store.commit('setCalling', true);
  store.commit('setCaller', data);
});

export default socket;
