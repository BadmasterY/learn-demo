import Router from 'koa-router';

import { users, articles, comments } from '../db';

import { getDate, dataType } from '../utils/util';
import { Response } from '../interfaces/response';
import { Users } from '../interfaces/models';
import {
    List as UserList,
    RegisterRequest as Register,
    ResetpassRequest as Reset,
    GetRequest,
    DeleteRequest,
    UpdateRequest,
    UserInfoRequest,
} from '../interfaces/users';

const router = new Router();

router.post('/login', async (ctx, next) => {
    const { username, password } = ctx.request.body;

    console.log(`[User] ${getDate()} login ${username}`);

    const response: Response = { error: 1 };
    await users.findOne({ username }).then(result => {
        if (result) {
            if (typeof result == 'object') {
                const { _id, url, bio, nickname, username, position, useState, removed } = (result as Users);
                if (useState === 1 && removed === 0) {
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
                        console.log(`[User] ${getDate()} login error:`, response.msg);
                    }
                } else {
                    response.msg = removed === 1 ? '当前用户不存在!' : '当前账户未启用!';
                    console.log(`[User] ${getDate()} login error:`, response.msg);
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
                console.log(`[User] ${getDate()} login error:`, response.msg);
            }
        } else {
            response.msg = '请稍后尝试!';
            console.log(`[User] ${getDate()} login error:`, response.msg);
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
        position: '用户',
        removed: 0,
        useState: 1,
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
                console.log(`[User] ${getDate()} login error:`, response.msg);
            }
        }).catch(err => {
            response.msg = '注册失败!';
            console.log(`[User] ${getDate()} register error:`, err);
        });

    } else {
        response.msg = `用户 ${username} 已注册!`;
        console.log(`[User] ${getDate()} login error:`, response.msg);
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

            if (updateResult) {
                const { ok } = (updateResult as { ok: number });

                if (ok === 1) {
                    response.error = 0;
                } else {
                    response.msg = '重置失败!';
                    console.log(`[User] ${getDate()} login error:`, response.msg);
                }
            } else {
                response.msg = '重置失败!';
                console.log(`[User] ${getDate()} login error:`, response.msg);
            }
        } else {
            response.msg = '密码错误, 请检查!';
            console.log(`[User] ${getDate()} login error:`, response.msg);
        }
    } else {
        response.msg = '用户不存在!';
        console.log(`[User] ${getDate()} login error:`, response.msg);
    }

    ctx.response.body = response;
});

router.post('/getUserList', async (ctx, next) => {
    const getUsers: GetRequest = ctx.request.body;
    const { page, pageSize, query } = getUsers;
    const skipSize = (page - 1) * pageSize;

    console.log(`[User] ${getDate()} getUserList`);

    const response: Response = { error: 1 };

    const allResult = await users.findAll({ removed: 0, ...query });
    if (dataType(allResult) === 'Array') {
        response.content = {
            maxLength: (allResult as Users[]).length,
        }

        await users.findAll({ removed: 0, ...query }, null, { skip: skipSize, limit: pageSize }).then(result => {
            if (result !== undefined && result !== null) {
                const temp: UserList[] = [];
                const res = (result as Users[]);
                for (let i = 0; i < res.length; i++) {
                    const item: UserList = {
                        id: res[i]._id,
                        nickname: res[i].nickname,
                        username: res[i].username,
                        position: res[i].position,
                        useState: res[i].useState,
                    };

                    temp.push(item);
                }
                response.error = 0;
                response.content = {
                    users: temp,
                    ...response.content,
                };
            } else {
                response.msg = '未找到相关数据!';
                console.log(`[User] ${getDate()} login error:`, response.msg);
            }
        }).catch(err => {
            response.msg = '查询失败! 请重试!';
            console.log(`[User] getUserList error:`, err);
        });
    } else {
        response.msg = '服务器异常!';
        console.log(`[User] ${getDate()} login error:`, response.msg);
    }

    ctx.response.body = response;
});

router.post('/deleteUser', async (ctx, next) => {
    const deleteUser: DeleteRequest = ctx.request.body;
    const { id } = deleteUser;

    console.log(`[User] ${getDate()} deleteUser: ${id}`);

    const response: Response = { error: 1 };

    await users.updateOne({ _id: id }, { removed: 1 }).then(result => {
        const { ok } = (result as { ok: number });

        if (ok === 1) {
            response.error = 0;
        } else {
            response.msg = '删除失败!';
            console.log(`[User] ${getDate()} login error:`, response.msg);
        }
    }).catch(err => {
        response.msg = '删除失败, 请稍后重试!';
        console.log(`[User] ${getDate()} deleteUser Error:`, err);
    });

    ctx.response.body = response;
});

router.post('/updateUser', async (ctx, next) => {
    const updateUser: UpdateRequest = ctx.request.body;
    const { id, updateUserData } = updateUser;

    console.log(`[User] ${getDate()} updateUser: ${id}`);

    const response: Response = { error: 1 };

    await users.updateOne({ _id: id }, updateUserData).then(result => {
        const { ok } = (result as { ok: number });

        if (ok === 1) {
            response.error = 0;
        } else {
            response.msg = '更新失败!';
            console.log(`[User] ${getDate()} login error:`, response.msg);
        }
    }).catch(err => {
        response.msg = '更新失败, 请稍后重试!';
        console.log(`[User] ${getDate()} updateUser Error:`, err);
    });

    ctx.response.body = response;
});

router.post('/getUserInfo', async (ctx, next) => {
    const updateUser: UserInfoRequest = ctx.request.body;
    const { id } = updateUser;

    console.log(`[User] ${getDate()} getUserInfo: ${id}`);

    const response: Response = { error: 1 };

    const articleResult = await articles.findAll({ removed: 0, authorId: id });
    const commentResult = await comments.findAll({ removed: 0, authorId: id });

    if (dataType(articleResult) === 'Array' && dataType(commentResult) === 'Array') {
        response.error = 0;
        response.content = {
            articles: articleResult.length,
            comments: commentResult.length,
        }
    } else {
        response.msg = '服务器异常!';
        console.log(`[User] ${getDate()} getUserInfo Error`);
    }

    ctx.response.body = response;
});

export default router.routes();