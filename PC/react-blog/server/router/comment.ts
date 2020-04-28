import Router from 'koa-router';

import { comments } from '../db';

import { getDate, dataType } from '../utils/util';
import { Response } from '../interfaces/response';
import { Comments } from '../interfaces/models';
import {
    GetCommentsRequset,
    GetCommentsResponse,
    DeleteCommentRequest,
} from '../interfaces/comments';

const router = new Router();

router.post('/addComment', async (ctx, next) => {
    const comment: Comments = ctx.request.body;

    console.log(`[Comment] ${getDate()} addComment`);

    const response: Response = { error: 1 };

    await comments.save({ ...comment, removed: 0 }).then(result => {
        if (result) {
            response.error = 0;
        } else {
            response.msg = '提交失败!';
        }
    }).catch(err => {
        response.msg = '服务器异常!';
        console.log(`[Comment] ${getDate()} addComment Error:`, err);
    });

    ctx.response.body = response;
});

router.post('/getComments', async (ctx, next) => {
    const comment: GetCommentsRequset = ctx.request.body;
    const { page, pageSize, query } = comment;

    const skipSize = (page - 1) * pageSize;

    console.log(`[Comment] ${getDate()} getComments`);

    const response: Response = { error: 1 };

    const allResult = await comments.findAll({ removed: 0, ...query });

    if (dataType(allResult) === 'Array') {
        response.content = {
            maxLength: (allResult as Comments[]).length,
        };

        await comments.findAll(
            {
                removed: 0,
                ...query
            },
            null,
            {
                skip: skipSize,
                limit: pageSize
            }).then(result => {
                const commentArr = (result as Comments[]);
                const comments: GetCommentsResponse[] = [];

                for (let i = 0; i < commentArr.length; i++) {
                    const item = commentArr[i];
                    comments.push({
                        id: item._id,
                        author: item.author,
                        content: item.content,
                        createTime: item.createTime,
                        updatedAt: item.updatedAt,
                    });
                }

                response.error = 0;
                response.content = {
                    comments,
                    ...response.content,
                };
            }).catch(err => {
                response.msg = '获取信息失败!';
                console.log(`[Comment] ${getDate()} getComments Error:`, err);
            })
    } else {
        response.msg = '服务器异常!';
        console.log(`[Comment] ${getDate()} getComments Error`);
    }

    ctx.response.body = response;
});

router.post('/deleteComment', async (ctx, next) => {
    const comment: DeleteCommentRequest = ctx.request.body;
    const { id } = comment;

    console.log(`[Comment] ${getDate()} deleteComment: ${id}`);

    const response: Response = { error: 1 };

    await comments.updateOne({ _id: id }, { removed: 1 }).then(result => {
        const { ok } = (result as { ok: number });

        if(ok === 1) {
            response.error = 0;
        }else {
            response.msg = '删除失败!';
        }
    }).catch(err => {
        response.msg = '服务器异常!';
        console.log(`[Comment] ${getDate()} deleteComment Error:`, err);
    })

    ctx.response.body = response;
});

export default router.routes();