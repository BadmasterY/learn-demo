const express = require('express'); // 就是那个 express
const formidable = require('formidable'); // 解析form data
const fs = require('fs'); // 文件系统
const cors = require('cors'); // 跨域
const app = express();

// 跨域设置
let corsOptions = {
    origin: true,
    optionsSuccessStatus: 200
}

// express router /upload
app.post('/upload', cors(corsOptions), async (req, res) => {

    // form data解析实例
    let form = new formidable.IncomingForm();
    let imgName, imgData;

    await form.parse(req, function (err, fields, files) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/html;charset=UTF8' });
            res.send({ error: err });
            return;
        }

        imgName = files.image.name;
        fs.readFile(files.image.path, (err, data) => {
            // 文件系统读取文件
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html;charset=UTF8' });
                res.send({ error: err });
                return;
            }

            imgData = data;
            // 文件系统保存文件
            fs.writeFile(`./uploads/${imgName}`, imgData, 'binary',(err) => {
                // 关闭连接
                res.end();
            });

        })
    });
});

// 服务器监听3000端口
app.listen(3000, () => console.log('Listening at http://127.0.0.1:3000.'));