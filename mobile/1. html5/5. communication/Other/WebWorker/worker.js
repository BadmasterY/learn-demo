// 斐波那契数列
function fibonacci(n) {
    return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}

// 监听 message 事件
this.addEventListener('message', e => {
    let resultValue = fibonacci(e.data); // 获取线程传递的数据
    console.log(resultValue);
    this.postMessage(resultValue); // 返回计算结果
})