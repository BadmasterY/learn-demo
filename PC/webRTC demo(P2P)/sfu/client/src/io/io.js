import io from 'socket.io-client'
import store from '../store/index'

const socket = io.connect('/socket', {
  autoConnect: false, // 自动连接
  transports: ['websocket']
});

// 连接成功
socket.on('connect', function () {
  console.log(`连接成功! socket 功能已启用...`)
});

socket.on('call', data => {
  console.log(data);
  store.commit('setCall');
});

export default socket;
