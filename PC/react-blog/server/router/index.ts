import Router from 'koa-router';
import { getDate } from '../utils/util';
import { users } from '../db';
import { Users } from '../interfaces/models';

const router = new Router();

// test
router.get('/', async (ctx) => {
    const { method, url } = ctx.request;
    let result: Users = { nickname: 'test', password: '111', position: 'test' };
    console.log(`[Router] ${getDate()} '${method}' url:'${url}' ok!`);
    await users.save(result).then(res => {
        if (typeof res == 'object') {
            if (res !== null) {
                result = (res as Users);
            }
        }
    }).catch(err => console.error(err));
    if (result)
        ctx.response.body = `Hello ${result.nickname}`;
});

const routes = router.routes();
export {
    routes,
}