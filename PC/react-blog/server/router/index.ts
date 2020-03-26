import Router from 'koa-router';
import { getDate } from '../utils/util';

const router = new Router();

// test
router.get('/', (ctx) => {
    console.log(`[Router] ${getDate()} '${ctx.request.method}' url:'${ctx.request.url}' ok!`);
    ctx.response.body = 'hello world';
});

const routes = router.routes();
export {
    routes,
}