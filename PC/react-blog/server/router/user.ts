import Router from 'koa-router';

import { getDate, dataType } from '../utils/util';
import { users } from '../db';
import { Response } from '../interfaces/response';
import { Users } from '../interfaces/models';
import { Register } from '../interfaces/register';
import { Reset } from '../interfaces/resetpassword';
import { Requset as UsersRequset } from '../interfaces/getUsers';

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
                        nickname,
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

router.post('/resetPassword', async (ctx, next) => {
    const reset: Reset = ctx.request.body;
    const { id, oldpass, newpass } = reset;

    console.log(`[User] ${getDate()} resetPassword ${id}`);

    const response: Response = { error: 1 };

    const findResult = await users.findOne({ _id: id });

    if (findResult) {
        const { password } = (findResult as Users);
        if (password === oldpass) {
            const updateResult = await users.updateOne({ _id: id }, { password: newpass });

            if(updateResult) {
                const { ok } = (updateResult as {ok: number});

                if( ok === 1 ) {
                    response.error = 0;
                }else {
                    response.msg = '重置失败!';
                }
            }else {
                response.msg = '重置失败!';
            }
        } else {
            response.msg = '未找到当前用户!';
        }
    } else {
        response.msg = '重置失败, 请稍后重试!';
    }

    ctx.response.body = response;
});

router.post('/getUserList', async (ctx, next) => {
    const getUsers: UsersRequset = ctx.request.body;
    const { page, pageSize, query } = getUsers;
    const skipSize = (page - 1) * pageSize;

    console.log(`[User] ${getDate()} getUserList`);

    const response: Response = { error: 1 };

    const allResult = await users.findAll(query);
    if(dataType(allResult) === 'Array') {
        response.content = {
            maxLength: (allResult as Users[]).length,
        }

        await users.findAll(query, null, {skip: skipSize, limit: pageSize}).then(result => {
            if(result !== undefined && result !== null) {
                response.error = 0;
                response.content = {
                    users: result,
                    ...response.content,
                };
            }else {
                response.msg = '未找到相关数据!';
            }
        }).catch(err => {
            response.msg = '查询失败! 请重试!';
            console.log(`[User] getUserList error:`, err);
        });
    }else {
        response.msg = '服务器异常!';
    }

    ctx.response.body = response;
});

export default router.routes();