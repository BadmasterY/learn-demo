import Router from 'koa-router';

import { articles } from '../db';

import { getDate, dataType } from '../utils/util';
import { Response } from '../interfaces/response';
import { Articles } from '../interfaces/models';
import { toObjectId } from '../db/base/Plugin';
import {
    PublishRequest,
    GetRequest,
    GetResult,
    GetResponse,
} from '../interfaces/articles';

const router = new Router();

router.post('/publish', async (ctx, next) => {
    const publish: PublishRequest = ctx.request.body;
    const { authorId } = publish;
    const id = toObjectId(authorId);

    console.log(`[Article] ${getDate()} publish: Author: ${authorId}`);

    const response: Response = { error: 1 };

    await articles.save({ ...publish, authorId: id, removed: 0 }).then(result => {
        if (result) {
            response.error = 0;
        } else {
            response.msg = '提交失败! 请稍后重试!';
            console.log(`[Article] ${getDate()} publish Error:`, response.msg);
        }
    }).catch(err => {
        response.msg = '提交失败! 服务器异常!';
        console.log(`[Article] ${getDate()} publish Error:`, err);
    });

    ctx.response.body = response;
});

router.post('/getArticleList', async (ctx, next) => {
    const getrequest: GetRequest = ctx.request.body;
    const { page, pageSize, query } = getrequest;

    const skip = (page - 1) * pageSize;

    console.log(`[Article] ${getDate()} getArticleList`);

    const response: Response = { error: 1 };

    const allResult = await articles.findAll({ removed: 0, ...query });
    if (dataType(allResult) === 'Array') {
        const { length } = (allResult as Articles[]);

        response.error = 0;
        response.content = {
            maxLength: length,
        }

        if (length > 0) {
            await articles.aggregate([
                { $match: { removed: 0, ...query } },
                { $skip: skip },
                { $limit: pageSize },
                {
                    $lookup: {
                        from: "users",
                        localField: "authorId",
                        foreignField: "_id",
                        as: "author",
                    }
                }
            ]).then(result => {
                const getResult = (result as GetResult[]);
                const resResult: GetResponse[] = [];
                for(let i = 0; i < getResult.length; i++) {
                    const { nickname, username, bio, url } = getResult[i].author[0];
                    let res: GetResponse = Object.assign({}, getResult[i], {
                        author: {
                            bio, 
                            url, 
                            nickname, 
                            username,
                        }
                    });
                    resResult.push(res);
                }
                response.content = {
                    ...response.content,
                    articles: resResult,
                }
            }).catch(err => {
                response.msg = '服务器异常!';
                console.log(`[Article] ${getDate()} getArticleList Error`, err);
            })
        } else {
            response.content = {
                ...response.content,
                articles: []
            }
        }
    } else {
        response.msg = '服务器异常!';
        console.log(`[Article] ${getDate()} getArticleList Error...`);
    }

    ctx.response.body = response;
});

export default router.routes();