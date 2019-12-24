import io from 'socket.io-client';
import store from '../store/index';

const socket = io.connect('/socket', {
    autoConnect: false,
    transports: ['websocket'],
});

socket.on('connect', () => {
    console.log('连接成功！socket 功能已启用...');
    console.log(`欢迎 ${store.state.user.username}`);
})

export default socket;