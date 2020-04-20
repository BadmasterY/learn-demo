import Router from 'koa-router';

import { comments } from '../db';

import { getDate, dataType } from '../utils/util';
import { Response } from '../interfaces/response';

const router = new Router();

router.post('/addComment', async (ctx, next) => {
    const comment = ctx.request.body;

    console.log(`[Comment] ${getDate()} addComment`);

    const response: Response = { error: 1 };

    ctx.response.body = response;
});

export default router.routes();