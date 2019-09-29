let message = [
    '今天天气不错',
    '热得快要疯掉',
    '蝉在叫，人坏掉',
    '算了，明天请假吧',
    '回去睡觉咯'
];

// 模拟服务器获取信息
let getMessage = () => {
    let index = Math.floor(Math.random() * 10); // [0, 10)
    return message[index] || null; // 不存在返回null
};

let postMessageLoop = () => {
    let randomTime = Math.floor(Math.random() * 10000); // [0, 10)秒
    setTimeout(() => {
        let message = getMessage();
        if(message !== null){
            // 消息不为空,发送到接收界面
            window.parent.postMessage(message, 'http://127.0.0.1:5500');
        }
        postMessageLoop();
    }, randomTime);
}

postMessageLoop();