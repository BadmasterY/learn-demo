let value = document.getElementById('calc-value');
let btn = document.getElementById('calc-btn');
let result = document.getElementById('result');

btn.addEventListener('click', e => {
    let inputValue = value.value;
    if(inputValue === '')return;
    let worker = new Worker('./worker.js'); // 初始化一个web worker
    worker.postMessage(inputValue); // 发送数据
    worker.addEventListener('message', e => { // 监听返回的结果
        result.innerHTML += `<p>${inputValue} => ${e.data}`;
    }, false);
}, false);