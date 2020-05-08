import Router from 'koa-router';

import { articles, comments } from '../db';

import { getDate, dataType } from '../utils/util';
import { Response } from '../interfaces/response';
import { Articles } from '../interfaces/models';
import { toObjectId } from '../db/base/Plugin';
import {
    PublishRequest,
    GetListRequest,
    GetResult,
    GetResponse,
    GetRequest,
    GetArticles,
    GetArticlesResult,
    GetArticlesResponse,
    DeleteRequest,
} from '../interfaces/articles';
import { Users } from '../interfaces/models';

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

/**
 * 首页加载
 */
router.post('/getArticleList', async (ctx, next) => {
    const getrequest: GetListRequest = ctx.request.body;
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
                for (let i = 0; i < getResult.length; i++) {
                    const { nickname, username, bio, url, avatarUrl } = getResult[i].author[0];
                    let res: GetResponse = Object.assign({}, getResult[i], {
                        author: {
                            bio,
                            url,
                            avatarUrl,
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

/**
 * 详细页加载
 */
router.post('/getArticle', async (ctx, next) => {
    const getrequest: GetRequest = ctx.request.body;
    const { id } = getrequest;

    console.log(`[Article] ${getDate()} getArticle: ${id}`);

    const response: Response = { error: 1 };

    const commentsResult = await comments.aggregate([
        { $match: { removed: 0, articleId: toObjectId(id) } },
        {
            $lookup: {
                from: "users",
                localField: "authorId",
                foreignField: "_id",
                as: "author",
            }
        },
    ]);

    await articles.aggregate([
        { $match: { removed: 0, _id: toObjectId(id) } },
        {
            $lookup: {
                from: "users",
                localField: "authorId",
                foreignField: "_id",
                as: "author",
            }
        },
    ])
        .then(result => {
            const getResult = (result as GetResult[]);

            if (getResult.length === 1) {
                response.error = 0;
                const { nickname, username, bio, avatarUrl, url } = getResult[0].author[0];
                const res: GetResponse = Object.assign({}, getResult[0], {
                    author: {
                        bio,
                        url,
                        avatarUrl,
                        nickname,
                        username,
                    },
                    comments: commentsResult,
                });
                response.content = res;
            } else if (getResult.length === 0) {
                response.msg = '未找到该文章!';
            } else {
                response.msg = '获取文章异常!';
            }
        })
        .catch(err => {
            response.msg = '服务器异常!';
            console.log(`[Article] ${getDate()} getArticle Error:`, err);
        });

    ctx.response.body = response;
});

/**
 * 后台管理获取信息
 */
router.post('/getArticles', async (ctx, next) => {
    const getrequest: GetArticles = ctx.request.body;
    const { page, pageSize, query } = getrequest;

    const skipSize = (page - 1) * pageSize;

    console.log(`[Article] ${getDate()} getArticles`);

    const response: Response = { error: 1 };

    const allResult = await articles.findAll({ removed: 0, ...query });

    if (dataType(allResult) === 'Array') {
        response.content = {
            maxLength: (allResult as Articles[]).length,
        };

        await articles.aggregate([
            { $match: { removed: 0 } },
            { $skip: skipSize },
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
            const articlesArr = (result as GetArticlesResult[]);
            const content: GetArticlesResponse[] = [];

            for (let i = 0; i < articlesArr.length; i++) {
                const item = articlesArr[i];
                content.push({
                    id: item._id,
                    title: item.title,
                    author: item.author[0].nickname,
                    createTime: item.createTime,
                    updatedAt: item.updatedAt,
                });
            }

            response.error = 0;
            response.content = {
                articles: content,
                ...response.content,
            };
        }).catch(err => {
            response.msg = '获取数据失败!';
            console.log(`[Article] ${getDate()} getArticles Error`, err);
        })
    } else {
        response.msg = '服务器异常!';
        console.log(`[Article] ${getDate()} getArticles Error`);
    }

    ctx.response.body = response;
});

router.post('/deletArticle', async (ctx, next) => {
    const getrequest: DeleteRequest = ctx.request.body;
    const { id } = getrequest;

    console.log(`[Article] ${getDate()} deleteArticle: ${id}`);

    const response: Response = { error: 1 };

    await articles.updateOne({_id: id}, { removed: 1 }).then(result => {
        const { ok } = (result as {ok: number});

        if(ok === 1) {
            response.error = 0;
        }else {
            response.msg = '删除失败!';
        }
    }).catch(err => {
        response.msg = '服务器异常!';
        console.log(`[Article] ${getDate()} deleteArticle Error:`, err);
    })

    ctx.response.body = response;
});

export default router.routes();