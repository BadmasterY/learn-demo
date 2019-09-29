let http = require('http');
let fs = require('fs');

let server = http.createServer((req, res) => {
    let index = './index.html'; // 默认页面
    let fileName, // 文件名
        interval; // 定时器

    // 判断路径,设置文件名
    if (req.url === '/') {
        fileName = index;
    } else {
        fileName = '.' + req.url;
    }

    // 如果是 SSE 设置相应头部信息
    if (fileName === './stream') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });

        // 过 10000s 重试
        res.write('retry: 10000\n');
        // 先发送一次时间信息
        res.write('data:' + (new Date()) + '\n\n');

        // 每秒发送一次时间
        interval = setInterval(() => {
            res.write('data:' + (new Date()) + '\n\n');
        }, 1000);

        // 监听连接关闭,同时清除定时器
        req.connection.addListener('close', () => clearInterval(interval), false);
    } else if (fileName === index) {
        // 判断是否为页面请求,并找到相应的文件返回页面
        fs.exists(fileName, exist => {
            if (exist) {
                fs.readFile(fileName, (err, content) => {
                    if (err) {
                        res.writeHead(500); // 未找到文件
                        res.end();
                    } else {
                        // 监听 close 事件
                        res.writeHead(200, {
                            'Content-Type': 'text/html',
                        });
                        res.end(content, 'utf-8');
                    }
                })
            } else {
                res.writeHead(404); // 未找到指定文件,返回404
                res.end();
            }
        });
    } else {
        res.writeHead(404); // 指定路径不存在,返回404
        res.end();
    }
});

server.listen(3000, () => {
    console.log('Server runing at http://127.0.0.1:3000.');
});