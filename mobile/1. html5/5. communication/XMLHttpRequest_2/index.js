document.querySelector('button').addEventListener('click', e => {
    // 阻止一下默认提交
    e.preventDefault();

    // 实例化
    let xhr = new XMLHttpRequest();
    
    if (typeof xhr.withCredentials === undefined) throw new Error('浏览器不支持...');

    xhr.onload = () => {
        // 转化为json
        let data = JSON.parse(xhr.responseText);
        // 显示返回数据
        document.querySelector('input').value = data.data;
    }

    xhr.onerror = e => {
        throw e;
    }

    // 请求地址和请求的方式
    xhr.open('GET', 'http://127.0.0.1:3000', true);

    xhr.send();
}, false);