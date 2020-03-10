const router = require('koa-router')();
const fs = require('fs');
const path = require('path');
const uploadPath = require('config').get('uploadPath');

const mkdirsSync = (dirname) => {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

router.post('/uploadStart', ctx => {
    const { id, name, index, file } = ctx.request.fields;

    const tempPath = path.join(uploadPath, `/temp/fileTemp_${id}`); // 临时目录

    if (!fs.existsSync(tempPath)) {
        mkdirsSync(tempPath);
    }

    fs.renameSync(file[0].path, `${tempPath}/${name}`); // 写入文件, 并修改位置

    ctx.body = { error: 0, name, subscript: index };
});

router.post('/uploadEnd', ctx => {
    const { id, name, total } = ctx.request.fields;

    const response = {error: 1};

    const tempPath = path.join(uploadPath, `/temp/fileTemp_${id}`); // 临时目录路径
    const filePath = path.join(uploadPath, `/${new Date().toLocaleDateString()}`); // 最终保存路径

    const tempList = fs.readdirSync(tempPath); // 获取临时目录路径下的文件列表

    // 如果上传的切片数与总切片数不一致, 删除服务器文件并返回错误信息
    if(tempList.length !== Number(total)) {
        response.msg = '上传数据异常! 请重新尝试!';
        ctx.body = response;
        
        // 清理服务器临时文件, 异步进行, 不要阻塞正常流程
        for(const item of tempList) {
            fs.unlink(path.join(tempPath, `/${item}`), err => {
                if(!err) {
                    console.log(`[Log]:Error: 发生错误! ${item} 成功移除!`);
                }else {
                    console.log(err);
                }
            });
        }
    
        fs.rmdir(tempPath, err => {
            if(!err) {
                console.log(`[Log]:Error: 发生错误! ${tempPath} 路径移除成功!`);
            }else {
                console.log(err);
            }
        });
        return;
    }
    
    if (!fs.existsSync(filePath)) {
        mkdirsSync(filePath);
    }

    const fileSavePath = path.join(filePath, `/${id}_${name}`); // 最终保存文件路径

    fs.writeFileSync(fileSavePath, ''); // 开始写入路径
    for(let key = 0; key < tempList.length; key++) {
        const temlFilePath = path.join(tempPath, `/${name}.${key}`); // 获取临时文件路径
        const tempFile = fs.readFileSync(temlFilePath); // 读取临时文件信息
        fs.appendFileSync(fileSavePath, tempFile); // 拼合临时文件

        fs.unlink(temlFilePath, err => {
            if(err) console.log(err);
        }); // 删除已拼合文件
    }

    fs.rmdir(tempPath, err => {
        if(err) console.log(err);
    }); // 删除临时目录

    response.error = 0;
    response.url = fileSavePath;
    ctx.body = response;
});

exports.routers = router.routes();