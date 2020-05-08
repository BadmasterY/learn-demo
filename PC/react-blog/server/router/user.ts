import Router from 'koa-router';
import fs from 'fs';
import path from 'path';

import { users, articles, comments } from '../db';

import { getDate, dataType, mkdirsSync } from '../utils/util';
import { Response } from '../interfaces/response';
import { Users } from '../interfaces/models';
import { Avatar } from '../interfaces/config'
import {
    List as UserList,
    RegisterRequest as Register,
    ResetpassRequest as Reset,
    GetRequest,
    DeleteRequest,
    UpdateRequest,
    UserInfoRequest,
    UserUploadAvatar,
} from '../interfaces/users';

import config from 'config';

const router = new Router();
const avatarConfig: Avatar = config.get('avatar');

// 登录
router.post('/login', async (ctx, next) => {
    const { username, password } = ctx.request.body;

    console.log(`[User] ${getDate()} login ${username}`);

    const response: Response = { error: 1 };
    await users.findOne({ username }).then(result => {
        if (result) {
            if (typeof result == 'object') {
                const { _id, url, bio, nickname, username, avatarUrl, position, useState, removed } = (result as Users);
                if (useState === 1 && removed === 0) {
                    if ((result as Users).password === password) {
                        response.error = 0;
                        response.content = {
                            id: _id,
                            url,
                            bio,
                            avatarUrl,
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

// 更新数据
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

// 注册
router.post('/register', async (ctx, next) => {
    const register: Register = ctx.request.body;
    const { username } = register;
    const user: Users = Object.assign({
        url: '',
        bio: '',
        avatarUrl: '',
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

// 重置密码
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

// 获取用户列表
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

// 删除用户
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

// 更新用户数据
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
            console.log(`[User] ${getDate()} updateUser error:`, response.msg);
        }
    }).catch(err => {
        response.msg = '更新失败, 请稍后重试!';
        console.log(`[User] ${getDate()} updateUser Error:`, err);
    });

    ctx.response.body = response;
});

// 在用户页面, 获取用户信息
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

// 上传头像
router.post('/uploadAvatar', async (ctx, next) => {
    const files = ctx.request.files;
    const uploadData: UserUploadAvatar = ctx.request.body;
    const { userId: id } = uploadData;

    console.log(`[User] ${getDate()} uploadAvatar: ${id}`);

    const response: Response = { error: 1 };

    if (files) {
        let isCreated = false;
        const filePath = path.join('./', `${avatarConfig.dirName}/${id}`);
        if (!fs.existsSync(filePath)) {
            isCreated = mkdirsSync(filePath);
        } else {
            isCreated = true;
        }

        if (isCreated) {
            const { file } = files;
            const suffix = file.name.split('.')[1];
            const savePath = `${filePath}/avatar.${suffix}`;
            console.log(savePath);
            fs.renameSync(file.path, savePath); // 写入文件, 并修改位置

            await users.updateOne({ _id: id }, { avatarUrl: savePath }).then(result => {
                const { ok } = (result as { ok: number });

                if (ok === 1) {
                    response.error = 0;
                    response.content = {
                        avatarUrl: savePath,
                    }
                } else {
                    response.msg = '更新失败!';
                    console.log(`[User] ${getDate()} uploadAvatar Error:`, response.msg);
                }
            }).catch(err => {
                response.msg = '更新失败, 请稍后重试!';
                console.log(`[User] ${getDate()} uploadAvatar Error:`, err);
            });
        } else {
            response.msg = '服务器异常!';
        }
    } else {
        response.msg = '文件获取异常!';
    }

    ctx.response.body = response;
});

// 获取头像
router.get('/avatars/*', ctx => {
    const { url } = ctx.request;

    let urlArr = url.split('/');
    const tempArr: string[] = [];
    urlArr.shift(); // 第一个为空字符串
    urlArr.shift();
    const newUrl = urlArr.join('/');
    const filePath = path.join('./', `${newUrl}`);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(`[User] getAvatar Error:`, err);
            return;
        }
    });

    const readStream = fs.createReadStream(filePath);

    ctx.body = readStream;
});

export default router.routes();