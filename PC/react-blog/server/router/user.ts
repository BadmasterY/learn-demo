import Router from 'koa-router';
import { getDate } from '../utils/util';
import { users } from '../db';
import { Response } from '../interfaces/response';
import { Users } from '../interfaces/models';

const router = new Router();

router.post('/login', async (ctx, next) => {
    const { username, password } = ctx.request.body;

    console.log(`[User] ${getDate()} login ${username}`);

    const response: Response = { error: 1 };
    await users.findOne({ username }).then(result => {
        if (result) {
            if (typeof result == 'object') {
                const { _id, nickname, position } = (result as Users);
                if ((result as Users).password === password) {
                    response.error = 0;
                    response.content = {
                        id: _id,
                        name: nickname,
                        position,
                    };
                }else {
                    response.msg = '密码错误!';
                }
            }
        } else {
            response.msg = '当前用户不存在!';
        }
    }).catch(err => {
        console.log(`[User] ${getDate()} Error:`, err);
        response.msg = '服务器异常, 请稍后尝试!'
    });

    ctx.response.body = response;
});

export default router.routes();