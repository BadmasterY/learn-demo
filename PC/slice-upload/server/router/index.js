const router = require('koa-router')();
const fs = require('fs');
const path = require('path');

const mkdirsSync = async (dirname) => {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

router.post('/uploadStart', async ctx => {
    const {time, name, index, total} = ctx;

    const uploadPath = './video';
    const tempPath = path.join(uploadPath, `/fileTemp_${name}`);
    const filePath = path.join(uploadPath, '')

    if(!fs.existsSync(tempPath)) {
        await mkdirsSync(tempPath);
    }
});


exports.routers = router.routes();