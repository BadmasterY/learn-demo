let http = require('http');

let server = http.createServer((req, res) => {
    // 设置允许跨域的域名
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    // 支持 POST GET 请求
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    // 设置接收到的数据编码
    req.setEncoding('utf8');
    // 返回测试数据
    res.end(JSON.stringify({data: 'Hello World!'}));
});

server.listen(3000, () => console.log('listening on http://127.0.0.1:3000.'));