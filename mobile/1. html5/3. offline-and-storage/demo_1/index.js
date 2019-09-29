var content = document.getElementById('content');

content.addEventListener('blur', e => {
    // 获取文本内容
    var data = content.value;

    console.log(data);
    // 保存内容
    if(navigator.onLine) {
        // 在线直接上传
        saveOnline(data);
    } else {
        // 离线本地化
        localStorage.setItem('data', data);
    }
});

function saveOnline(data) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', '/savedata');
    xhr.send('data=' + data);
}

// 上线监听
window.addEventListener('online', e => {
    var data = localStorage.getItem('data');

    // 没有数据就直接跳出
    if(!!!data) return;

    // 将本地数据上传
    saveOnline(data);
    // 移除本地数据
    localStorage.removeItem('data');
});
