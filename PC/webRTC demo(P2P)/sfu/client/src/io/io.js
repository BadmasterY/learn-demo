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
  console.log(`欢迎 ${store.state.user.nickname}!`);
  socket.emit('online', store.state.user);
});

socket.on('online', data => {
  console.log(`onlines change ${data}`);
  // something change
});

socket.on('call', data => {
  console.log(data);
  store.commit('setCalling', true);
  store.commit('setCaller', data);
});

socket.on('reply',async data => {
  console.log(data);
  if(data.accept) {
    let peer = await initPeer();
    let offer = await createOffer(peer);

    socket.emit('offer', {id: store.state.user.id, offer: offer});
    store.commit('setPeer', peer);
  }else {
    console.log('no! user reject...');
  }
});

socket.on('answer', data => {
  onAnswer(data);
});

socket.on('ice', data => {
  onICE(data);
});

socket.on('stream', data => {
  console.log(data);
  // const stream = data.streams.streams;
  // store.commit('setStream', data);
  // store.state.video.src = URL.createObjectURL(stream[0]);
})

export default socket;
