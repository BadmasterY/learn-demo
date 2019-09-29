window.addEventListener('load', e => {
    let uid; // 游客ID
    let ws = new WebSocket('ws://localhost:3000');

    let name = document.querySelector('span.name'); // 昵称
    let chat = document.querySelector('div.chat'); // 聊天内容
    let message = document.querySelector('input.message'); // 消息框
    let btn = document.querySelector('input.send-btn'); // 发送按钮

    ws.addEventListener('message', message => {
        let msg = JSON.parse(message.data);

        switch (msg.type) {
            case 'assign':
                // 进入聊天室,分配 uid
                uid = msg.uid;
                name.innerText = `游客${uid}`;
                break;
            case 'welcome':
                //显示消息
                chat.innerHTML += `
                <span class="user">系统消息:</span>
                <div class="chat-message">欢迎游客${msg.uid}...</div>
                `;
                break;
            case 'message':
                //显示消息
                chat.innerHTML += `
                <span class="user">游客${msg.uid}说:</span>
                <div class="chat-message">${msg.message}</div>
                `;
                break;
            case 'leave':
                //显示消息
                chat.innerHTML += `
                <span class="user">系统消息:</span>
                <div class="chat-message">游客${msg.uid}退出聊天室.</div>
                `;
                break;
            default:
                console.warn(`TYPEERROR: ${msg.type} is not found!`);
                break;
        }
    });

    // 点击发送消息
    btn.addEventListener('click', e => {
        let msg = message.value;
        if (msg == '') return;

        ws.send(JSON.stringify({
            uid: uid,
            message: msg
        }));

        message.value = '';

    }, false);
}, false);