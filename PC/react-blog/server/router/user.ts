import Router from 'koa-router';

import { getDate } from '../utils/util';
import { users } from '../db';
import { Response } from '../interfaces/response';
import { Users } from '../interfaces/models';
import { Register } from '../interfaces/register';

const router = new Router();

router.post('/login', async (ctx, next) => {
    const { username, password } = ctx.request.body;

    console.log(`[User] ${getDate()} login ${username}`);

    const response: Response = { error: 1 };
    await users.findOne({ username }).then(result => {
        if (result) {
            if (typeof result == 'object') {
                const { _id, url, bio, nickname, username, position } = (result as Users);
                if ((result as Users).password === password) {
                    response.error = 0;
                    response.content = {
                        id: _id,
                        url,
                        bio,
                        name: nickname,
                        username,
                        position,
                    };
                } else {
                    response.msg = '密码错误!';
                }
            }
        } else {
            response.msg = '当前用户不存在!';
        }
    }).catch(err => {
        console.log(`[User] ${getDate()} login error:`, err);
        response.msg = '服务器异常, 请稍后尝试!'
    });

    ctx.response.body = response;
});

router.post('/update', async (ctx, next) => {
    const update: Users = ctx.request.body;
    const { id } = update;

    console.log(`[User] ${getDate()} update ${id}`);

    const response: Response = { error: 1 };

    await users.updateOne({ _id: id }, update).then(result => {
        if (typeof result === 'object') {
            if (result !== null && (result as { ok: number }).ok === 1) {
                response.error = 0;
            } else {
                response.msg = '更新失败!';
            }
        } else {
            response.msg = '请稍后尝试!';
        }
    }).catch(err => {
        console.log(`[User] ${getDate()} update error:`, err);
        response.msg = '服务器异常, 请稍后尝试!';
    });

    ctx.response.body = response;
});

router.post('/register', async (ctx, next) => {
    const register: Register = ctx.request.body;
    const { username } = register;
    const user: Users = Object.assign({
        url: '',
        bio: '',
        position: '用户'
    }, register);

    console.log(`[User] ${getDate()} register ${username}`);

    const response: Response = { error: 1 };

    const finded = await users.findOne({ username });
    if (finded === null) {
        await users.save(user).then(result => {
            if (result) {
                response.error = 0;
            } else {
                response.msg = '请稍后重试!';
            }
        }).catch(err => {
            response.msg = '注册失败!';
            console.log(`[User] ${getDate()} register error:`, err);
        });

    } else {
        response.msg = '该用户已注册!';
    }
    ctx.response.body = response;
});

export default router.routes();