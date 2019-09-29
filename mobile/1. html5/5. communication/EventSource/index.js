window.addEventListener('load', e => {
    let status = document.getElementById('status');
    let output = document.getElementById('output');

    if (!window.EventSource) throw new Error('啊哦,浏览器不支持...');

    // 向服务器建立连接
    let source = new EventSource('stream');
    // 监听 message 事件,获取服务端发送的数据
    source.addEventListener('message', e => {
        output.textContent = e.data;
    }, false);

    // 监听 open 事件,判断是否连接
    source.addEventListener('open', e => {
        status.textContent = '连接打开了...';
    }, false);

    // 监听 error 事件,处理连接错误的问题
    source.addEventListener('error', e => {
        if (e.target.readyState === EventSource.CLOSED) {
            source.close();
            status.textContent = '连接断开...';
        } else {
            status.textContent = '连接断开,未知错误!';
        }
    }, false);
}, false);