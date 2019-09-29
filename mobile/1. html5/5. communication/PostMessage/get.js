let doc = window.document;
let msgList = doc.querySelector('#messageList');

// 处理新的消息
let handler = msg => {
    let li = doc.createElement('li');
    li.innerText = msg;
    msgList.appendChild(li); // 把新消息放到消息列表中
};

// 监听 postMessage 发送消息
window.addEventListener('message', e => {
    // 判断消息来源是否正确
    if(e.origin === 'http://127.0.0.1:5500') {
        handler(e.data); // 处理消息
    }
}, false);
