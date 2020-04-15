import Router from 'koa-router';

import { articles } from '../db';

import { getDate } from '../utils/util';
import { Response } from '../interfaces/response';
import { Articles } from '../interfaces/models';
import {
    PublishRequest,
    GetRequest,
} from '../interfaces/articles';

const router = new Router();

router.post('/publish',async (ctx, next) => {
    const publish: PublishRequest = ctx.request.body;
    const { author } = publish;

    console.log(`[Article] ${getDate()} publish: Author: ${author}`);

    const response: Response = { error: 1 };

    await articles.save(publish).then(result => {
        if(result) {
            response.error = 0;
        }else {
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
    console.log(getrequest);

    console.log(`[Article] ${getDate()} getArticleList`);

    const response: Response = { error: 1 };

    ctx.response.body = response;
});

export default router.routes();